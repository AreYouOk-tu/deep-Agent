import { useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { sendMessage } from '@/api/messages'

export function useStreamChat() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const { addMessage, updateLastMessage, setIsStreaming } = useChatStore()

  const send = async (conversationId: string, content: string) => {
    abortControllerRef.current = new AbortController()

    addMessage({
      id: `msg-${Date.now()}`,
      conversationId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    })

    const assistantId = `msg-${Date.now() + 1}`
    addMessage({
      id: assistantId,
      conversationId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    })

    setIsStreaming(true)
    let accumulated = ''

    try {
      await sendMessage(
        conversationId,
        content,
        (chunk) => {
          accumulated += chunk
          updateLastMessage(accumulated)
        },
        abortControllerRef.current.signal
      )
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const stop = () => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }

  return { send, stop }
}
