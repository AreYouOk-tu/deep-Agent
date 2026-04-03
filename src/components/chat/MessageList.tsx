import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useChatStore } from '@/stores/chatStore'
import { MessageBubble } from './MessageBubble'
import { ChevronDown } from 'lucide-react'

export function MessageList() {
  const { messages } = useChatStore()
  const { ref, isAtBottom, scrollToBottom } = useAutoScroll<HTMLDivElement>([messages])

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={ref} className="h-full overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  )
}
