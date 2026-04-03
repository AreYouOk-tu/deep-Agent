import type { Agent } from '@/types'

// Mock data
export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'General Assistant',
    avatar: '🤖',
    description: 'A versatile AI assistant for general tasks',
    capabilities: ['Chat', 'Q&A', 'Writing'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Code Expert',
    avatar: '💻',
    description: 'Specialized in programming and technical support',
    capabilities: ['Coding', 'Debugging', 'Code Review'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Creative Writer',
    avatar: '✍️',
    description: 'Expert in creative writing and content creation',
    capabilities: ['Writing', 'Storytelling', 'Editing'],
    createdAt: new Date().toISOString(),
  },
]

export async function getAgents(): Promise<Agent[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAgents), 300)
  })
}
