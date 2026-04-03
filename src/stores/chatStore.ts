import { create } from 'zustand'
import type { Agent, Conversation, Message } from '@/types'

interface ChatState {
  agents: Agent[]
  currentAgent: Agent | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isStreaming: boolean

  setAgents: (agents: Agent[]) => void
  setCurrentAgent: (agent: Agent | null) => void
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (conversation: Conversation | null) => void
  addConversation: (conversation: Conversation) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateLastMessage: (patch: Partial<Pick<Message, 'content' | 'thinking' | 'reasoning' | 'status' | 'error'>>) => void
  setIsStreaming: (streaming: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  agents: [],
  currentAgent: null,
  conversations: [],
  currentConversation: null,
  messages: [],
  isStreaming: false,

  setAgents: (agents) => set({ agents }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (patch) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = { ...last, ...patch }
      }
      return { messages }
    }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}))
