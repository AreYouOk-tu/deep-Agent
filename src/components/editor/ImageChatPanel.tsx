import { useState, useRef, useCallback } from 'react'
import type { KeyboardEvent } from 'react'
import { Send, Loader2, AlertCircle, Paperclip, X, ImageIcon } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { editImage } from '@/api/fixImage'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import type { EditMessage } from '@/types/editor'

interface PendingLogo {
  name: string
  base64: string
}

export function ImageChatPanel() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [pendingLogo, setPendingLogo] = useState<PendingLogo | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const messages = useEditorStore((s) => s.messages)
  const currentImage = useEditorStore((s) => s.currentImage)
  const isProcessing = useEditorStore((s) => s.isProcessing)
  const addUserMessage = useEditorStore((s) => s.addUserMessage)
  const addAIMessage = useEditorStore((s) => s.addAIMessage)
  const updateAIMessage = useEditorStore((s) => s.updateAIMessage)
  const setProcessing = useEditorStore((s) => s.setProcessing)
  const setCurrentImage = useEditorStore((s) => s.setCurrentImage)

  const { ref: scrollRef } = useAutoScroll<HTMLDivElement>([messages])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPendingLogo({ name: file.name, base64: reader.result as string })
    }
    reader.readAsDataURL(file)
    // 重置 input 以便再次选择同一文件
    e.target.value = ''
  }, [])

  const handleSend = async () => {
    if (!input.trim() || !currentImage || isProcessing) return
    const text = input.trim()
    const logo = pendingLogo
    setInput('')
    setPendingLogo(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // 用户消息（带附件信息）
    const userMsg: EditMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      attachment: logo ? { name: logo.name, base64: logo.base64 } : undefined,
      timestamp: new Date().toISOString(),
    }
    useEditorStore.getState().messages // trigger
    useEditorStore.setState((s) => ({ messages: [...s.messages, userMsg] }))

    addAIMessage('')
    setProcessing(true)

    updateAIMessage({ status: 'thinking' })
    await new Promise((r) => setTimeout(r, 2000))
    updateAIMessage({ status: 'processing', content: '正在处理图片，请稍候...' })

    try {
      const result = await editImage(currentImage, text, logo?.base64)
      updateAIMessage({
        content: result.description,
        image: result.resultImage,
        status: 'done',
      })
    } catch (e) {
      updateAIMessage({
        error: e instanceof Error ? e.message : '处理失败',
        status: 'error',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const canSend = !!input.trim() && !!currentImage && !isProcessing

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-4xl mb-3">✏️</div>
            <h3 className="text-base font-medium text-gray-700 mb-1">告诉我你想怎么修改</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              例如：「把标题改成 Hello World」<br />
              「把左上角的 logo 替换掉」<br />
              「调整底部文字的位置到中间」<br />
              点击 📎 上传 logo 并指定位置
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onClickImage={(img) => {
                setCurrentImage(img)
                setPreviewImage(img)
              }}
            />
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100">
        {/* Logo 预览标签 */}
        {pendingLogo && (
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
              <img
                src={pendingLogo.base64}
                alt={pendingLogo.name}
                className="w-8 h-8 object-contain rounded"
              />
              <span className="text-xs text-purple-700 max-w-[120px] truncate">{pendingLogo.name}</span>
              <button
                onClick={() => setPendingLogo(null)}
                className="p-0.5 text-purple-400 hover:text-purple-600 rounded"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div
          className={`
            flex items-end gap-2 rounded-2xl border transition-all duration-200 bg-white px-3 py-2
            ${focused
              ? 'border-purple-400 shadow-[0_0_0_3px_rgba(147,51,234,0.1)]'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          {/* 上传按钮 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            title="上传 Logo / 图片素材"
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-40"
          >
            <Paperclip size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); handleInput() }}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={pendingLogo ? "描述 logo 的位置和大小..." : "描述你想修改的内容..."}
            rows={1}
            disabled={isProcessing}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-6 disabled:opacity-60"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            title="发送"
            className={`
              flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all
              ${canSend
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* 图片全屏预览弹窗 */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="预览"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

// ---- 消息项组件 ----

function MessageItem({
  message,
  onClickImage,
}: {
  message: EditMessage
  onClickImage: (img: string) => void
}) {
  const isUser = message.role === 'user'
  const { status, error } = message

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] space-y-1.5">
          {/* 附件缩略图 */}
          {message.attachment && (
            <div className="flex justify-end">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-purple-500/20 rounded-xl">
                <img
                  src={message.attachment.base64}
                  alt={message.attachment.name}
                  className="w-10 h-10 object-contain rounded"
                />
                <span className="text-xs text-purple-200 max-w-[100px] truncate">{message.attachment.name}</span>
              </div>
            </div>
          )}
          <div className="px-3.5 py-2.5 rounded-2xl bg-purple-600 text-white">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    )
  }

  // AI 消息
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2">
        {(status === 'thinking' || status === 'processing') && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-500">
            <Loader2 size={14} className="animate-spin text-purple-500" />
            <span className="text-xs">
              {status === 'thinking' ? 'AI 正在理解你的需求...' : '正在处理图片...'}
            </span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-red-50 border border-red-100 text-red-600">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">{error ?? '处理失败，请稍后重试。'}</p>
          </div>
        )}

        {status === 'done' && message.content && (
          <div className="px-3.5 py-2.5 rounded-2xl bg-gray-50">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}

        {status === 'done' && message.image && (
          <button
            onClick={() => onClickImage(message.image!)}
            className="group relative block rounded-xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-colors max-w-[200px]"
          >
            <img src={message.image} alt="修改结果" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/50 px-2 py-1 rounded">
                点击预览
              </span>
            </div>
          </button>
        )}

        {status === 'done' && (
          <span className="text-[10px] text-gray-400 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}
