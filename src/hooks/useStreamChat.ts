import { useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { sendMessage } from '@/api/messages'
import { generateImage } from '@/api/imageGen'
import type { StreamEvent } from '@/types'

const IMAGE_GEN_AGENT_ID = '1'

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

    addMessage({
      id: `msg-${Date.now() + 1}`,
      conversationId,
      role: 'assistant',
      content: '',
      thinking: '',
      reasoning: '',
      status: 'thinking',
      timestamp: new Date().toISOString(),
    })

    setIsStreaming(true)

    // 判断当前 agent 是否为"AI 智能生图"
    const currentAgent = useChatStore.getState().currentAgent
    if (currentAgent?.id === IMAGE_GEN_AGENT_ID) {
      await handleImageGen(content)
    } else {
      await handleStreamChat(conversationId, content)
    }
  }

  const handleImageGen = async (prompt: string) => {
    try {
      updateLastMessage({ content: '正在生成图片，请稍候...', status: 'reasoning' })
      const result = await generateImage(prompt)
      updateLastMessage({
        content: `已生成图片\n\n`,
        image: result.image_url,
        status: 'done',
      })
    } catch (e) {
      updateLastMessage({
        error: e instanceof Error ? e.message : '图片生成失败，请稍后重试。',
        status: 'error',
      })
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStreamChat = async (conversationId: string, content: string) => {
    let thinkingAcc = ''
    let reasoningAcc = ''
    let contentAcc = ''

    const handleEvent = (event: StreamEvent) => {
      switch (event.type) {
        case 'thinking':
          thinkingAcc += event.content
          updateLastMessage({ thinking: thinkingAcc, status: 'thinking' })
          break
        case 'reasoning':
          reasoningAcc += event.content
          updateLastMessage({ reasoning: reasoningAcc, status: 'reasoning' })
          break
        case 'content':
          contentAcc += event.content
          updateLastMessage({ content: contentAcc, status: 'streaming' })
          break
        case 'error':
          updateLastMessage({ error: event.content, status: 'error' })
          break
        case 'done':
          updateLastMessage({ status: 'done' })
          break
      }
    }

    try {
      await sendMessage(conversationId, content, handleEvent, abortControllerRef.current!.signal)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        updateLastMessage({ status: 'done' })
      } else {
        updateLastMessage({ error: '请求发生异常，请稍后重试。', status: 'error' })
      }
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
