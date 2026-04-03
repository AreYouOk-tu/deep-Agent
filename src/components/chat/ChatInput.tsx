import { useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Send, Square, Mic, MicOff } from 'lucide-react'
import { useStreamChat } from '@/hooks/useStreamChat'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { useChatStore } from '@/stores/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentConversation, isStreaming } = useChatStore()
  const { send, stop } = useStreamChat()
  const { isListening, isSupported, start } = useVoiceInput()

  const handleSend = async () => {
    if (!input.trim() || !currentConversation || isStreaming) return
    const text = input.trim()
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    await send(currentConversation.id, text)
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
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const handleVoice = () => {
    start((text) => setInput((prev) => prev + text))
  }

  const canSend = !!input.trim() && !!currentConversation && !isStreaming

  return (
    <div className="px-4 pb-4 pt-2 bg-white">
      <div
        className={`
          flex flex-col rounded-2xl border transition-all duration-200 bg-white
          ${focused
            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
            : 'border-gray-200 hover:border-gray-300 shadow-sm'
          }
        `}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); handleInput() }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="发送消息，Enter 发送，Shift+Enter 换行"
          rows={1}
          disabled={isStreaming}
          className="
            w-full resize-none px-4 pt-3 pb-2 bg-transparent
            text-sm text-gray-800 placeholder-gray-400
            focus:outline-none leading-6
            disabled:opacity-60
          "
          style={{ minHeight: '44px', maxHeight: '160px' }}
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-1">
            {isSupported && (
              <button
                onClick={handleVoice}
                disabled={isStreaming}
                title={isListening ? '正在听...' : '语音输入'}
                className={`
                  p-1.5 rounded-lg transition-colors text-sm
                  ${isListening
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <span className="text-xs text-gray-400">生成中...</span>
            )}
            {isStreaming ? (
              <button
                onClick={stop}
                title="停止生成"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <Square size={14} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!canSend}
                title="发送"
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg transition-all
                  ${canSend
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">AI 生成内容仅供参考</p>
    </div>
  )
}
