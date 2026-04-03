import { memo } from 'react'
import { Brain, GitBranch, AlertCircle, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const { status, error } = message

  const isThinking = status === 'thinking'
  const isReasoning = status === 'reasoning'
  const isStreaming = status === 'streaming'
  const isError = status === 'error'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar fallback={isUser ? 'U' : 'AI'} size="sm" />

      <div className={`max-w-[72%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        {/* 状态指示器 */}
        {!isUser && (isThinking || isReasoning) && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1.5 rounded-full bg-gray-100 text-gray-500 text-xs">
            <Loader2 size={11} className="animate-spin text-blue-400 flex-shrink-0" />
            {isThinking && <><Brain size={11} className="flex-shrink-0" /><span>思考中...</span></>}
            {isReasoning && <><GitBranch size={11} className="flex-shrink-0" /><span>分析中...</span></>}
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
        {!isError && !isThinking && !isReasoning && (
          <div className={isUser ? 'px-3.5 py-2.5 rounded-[18px] bg-blue-600 text-white' : ''}>
            <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-0.5 h-3 ml-0.5 bg-gray-400 animate-pulse align-middle" />
              )}
            </p>
          </div>
        )}

        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
})
