import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, MessageSquare } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { getAgents } from '@/api/agents'
import { getConversations, createConversation } from '@/api/conversations'
import { Avatar } from '@/components/ui/Avatar'
import type { Agent } from '@/types'

export function Sidebar() {
  const { agents, setAgents, currentAgent, setCurrentAgent, conversations, setConversations, addConversation, setCurrentConversation, setMessages } = useChatStore()

  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  })

  useEffect(() => {
    if (agentsData) {
      setAgents(agentsData)
      if (!currentAgent && agentsData.length > 0) {
        setCurrentAgent(agentsData[0])
      }
    }
  }, [agentsData])

  const { data: convData } = useQuery({
    queryKey: ['conversations', currentAgent?.id],
    queryFn: () => getConversations(currentAgent!.id),
    enabled: !!currentAgent,
  })

  useEffect(() => {
    if (convData) setConversations(convData)
  }, [convData])

  const handleNewConversation = async () => {
    if (!currentAgent) return
    const conv = await createConversation(currentAgent.id)
    addConversation(conv)
    setCurrentConversation(conv)
    setMessages([])
  }

  const handleSelectAgent = (agent: Agent) => {
    setCurrentAgent(agent)
    setCurrentConversation(null)
    setMessages([])
  }

  return (
    <aside className="w-72 flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">AI Agent</h1>
      </div>

      {/* Agents */}
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Agents</p>
        <div className="space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentAgent?.id === agent.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Avatar fallback={agent.avatar ?? agent.name[0]} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{agent.name}</div>
                <div className="text-xs text-gray-500 truncate">{agent.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">History</p>
          <button
            onClick={handleNewConversation}
            disabled={!currentAgent}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setCurrentConversation(conv)
                setMessages([])
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <MessageSquare size={14} className="flex-shrink-0 text-gray-400" />
              <span className="text-sm truncate">{conv.title}</span>
            </button>
          ))}
          {conversations.length === 0 && currentAgent && (
            <p className="text-xs text-gray-400 text-center py-4">No conversations yet</p>
          )}
        </div>
      </div>
    </aside>
  )
}
