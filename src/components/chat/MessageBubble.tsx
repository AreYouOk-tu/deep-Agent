import { memo, useState } from 'react'
import { Brain, GitBranch, AlertCircle, Loader2, Download, X } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const { status, error } = message
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const isThinking = status === 'thinking'
  const isReasoning = status === 'reasoning'
  const isStreaming = status === 'streaming'
  const isError = status === 'error'

  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-generated-${Date.now()}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar fallback={isUser ? 'U' : 'AI'} size="sm" />

      <div className={`max-w-[72%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        {/* 状态指示器 */}
        {!isUser && (isThinking || isReasoning) && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1.5 rounded-full bg-gray-100 text-gray-500 text-xs">
            <Loader2 size={11} className="animate-spin text-blue-400 flex-shrink-0" />
            {isThinking && <><Brain size={11} className="flex-shrink-0" /><span>思考中...</span></>}
            {isReasoning && <><GitBranch size={11} className="flex-shrink-0" /><span>生成中...</span></>}
          </div>
        )}

        {/* 报错提示 */}
        {isError && (
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[18px] bg-red-50 border border-red-100 text-red-600">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">{error ?? '请求失败，请稍后重试。'}</p>
          </div>
        )}

        {/* 正文气泡 */}
        {!isError && !isThinking && !isReasoning && message.content && (
          <div className={isUser ? 'px-3.5 py-2.5 rounded-[18px] bg-blue-600 text-white' : ''}>
            <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-0.5 h-3 ml-0.5 bg-gray-400 animate-pulse align-middle" />
              )}
            </p>
          </div>
        )}

        {/* 生成的图片 */}
        {!isError && message.image && status === 'done' && (
          <div className="mt-2 space-y-2">
            <button
              onClick={() => setPreviewImage(message.image!)}
              className="group relative block rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors max-w-[280px]"
            >
              <img src={message.image} alt="AI 生成" className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/50 px-2 py-1 rounded">
                  点击预览
                </span>
              </div>
            </button>
            <button
              onClick={() => handleDownload(message.image!)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Download size={12} />
              下载图片
            </button>
          </div>
        )}

        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
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
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="预览"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => handleDownload(previewImage)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Download size={14} />
              下载图片
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
