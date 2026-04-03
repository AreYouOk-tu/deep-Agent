import { useChatStore } from '@/stores/chatStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

export function ChatWindow() {
  const { currentAgent, currentConversation } = useChatStore()

  if (!currentAgent) {
    return <EmptyState icon="🤖" title="Select an agent" description="Choose an agent from the sidebar to start chatting" />
  }

  if (!currentConversation) {
    return <EmptyState icon="💬" title="Start a conversation" description="Click the + button to create a new conversation" />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 px-4 py-3 bg-white">
        <h2 className="font-semibold text-gray-900">{currentAgent.name}</h2>
        <p className="text-xs text-gray-500">{currentAgent.description}</p>
      </div>
      <MessageList />
      <ChatInput />
    </div>
  )
}
