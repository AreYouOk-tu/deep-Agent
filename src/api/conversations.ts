import type { Conversation } from '@/types'

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    agentId: '1',
    title: 'Getting Started',
    lastMessage: 'How can I help you today?',
    lastMessageTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

export async function getConversations(agentId: string): Promise<Conversation[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConversations.filter(c => c.agentId === agentId))
    }, 200)
  })
}

export async function createConversation(agentId: string): Promise<Conversation> {
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    agentId,
    title: 'New Conversation',
    lastMessageTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(newConv), 200)
  })
}
