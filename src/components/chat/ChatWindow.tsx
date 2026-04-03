import { useChatStore } from '@/stores/chatStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

export function ChatWindow() {
  const { currentAgent, currentConversation } = useChatStore()

  if (!currentAgent) {
    return <EmptyState icon="🤖" title="Select an agent" description="Choose an agent from the sidebar to start chatting" />
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <ChatInput />
    </div>
  )
}
