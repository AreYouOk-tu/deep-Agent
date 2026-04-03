export interface Agent {
  id: string
  name: string
  avatar?: string
  description: string
  capabilities: string[]
  createdAt: string
}

export type MessageStatus = 'thinking' | 'reasoning' | 'streaming' | 'done' | 'error'

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  reasoning?: string
  status?: MessageStatus
  error?: string
  timestamp: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface Conversation {
  id: string
  agentId: string
  title: string
  lastMessage?: string
  lastMessageTime: string
  createdAt: string
}

export type StreamEventType = 'thinking' | 'reasoning' | 'content' | 'error' | 'done'

export interface StreamEvent {
  type: StreamEventType
  content: string
}
