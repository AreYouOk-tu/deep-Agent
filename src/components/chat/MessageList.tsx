import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useChatStore } from '@/stores/chatStore'
import { MessageBubble } from './MessageBubble'
import { ChevronDown } from 'lucide-react'

export function MessageList() {
  const { messages } = useChatStore()
  const { ref, isAtBottom, scrollToBottom } = useAutoScroll<HTMLDivElement>([messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-3">👋</div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">开始对话</h3>
          <p className="text-sm text-gray-400">在下方输入框发送消息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-gray-50" style={{ contain: 'layout style paint' }}>
      <div 
        ref={ref} 
        className="h-full overflow-y-auto px-4 py-6 space-y-4"
        style={{ willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronDown size={18} className="text-gray-600" />
        </button>
      )}
    </div>
  )
}
