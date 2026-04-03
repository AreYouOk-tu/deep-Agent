import type { Message } from '@/types'

export async function getMessages(_conversationId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 200)
  })
}

export async function sendMessage(
  _conversationId: string,
  _content: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const mockResponse = 'This is a mock streaming response. In production, this would connect to your AI backend API.'

  return new Promise((resolve) => {
    let index = 0
    const interval = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(interval)
        resolve()
        return
      }

      if (index < mockResponse.length) {
        onChunk(mockResponse[index])
        index++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, 30)
  })
}
