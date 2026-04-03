import type { Message, StreamEvent } from '@/types'

export async function getMessages(_conversationId: string): Promise<Message[]> {
  return new Promise((resolve) => setTimeout(() => resolve([]), 200))
}

async function streamText(
  text: string,
  type: StreamEvent['type'],
  onEvent: (e: StreamEvent) => void,
  signal?: AbortSignal,
  delay = 18
): Promise<void> {
  return new Promise((resolve, reject) => {
    let index = 0
    const interval = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(interval)
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      if (index < text.length) {
        onEvent({ type, content: text[index] })
        index++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, delay)
  })
}

const MOCK_RESPONSES: Array<{ thinking: string; reasoning: string; content: string }> = [
  {
    thinking: '用户提出了一个问题，我需要理解其意图。首先分析问题的关键词，然后结合知识库进行推断...',
    reasoning: '经过初步分析，这个问题涉及到以下几个维度：\n1. 背景知识的梳理\n2. 相关概念的关联\n3. 最优解的路径选择\n\n综合以上因素，我得出以下结论：',
    content: '感谢你的提问！这是一个很好的问题。根据我的分析，可以从以下几个方面来回答：\n\n首先，需要了解基本概念；其次，结合实际场景进行分析；最后，给出具体的建议和方案。\n\n如果你需要更详细的解释，欢迎继续追问。',
  },
  {
    thinking: '这是一个需要深度思考的问题。让我从多个角度来审视这个问题的本质...',
    reasoning: '从技术角度分析：\n• 方案 A：优点是简单直接，缺点是扩展性差\n• 方案 B：优点是灵活可扩展，缺点是实现复杂\n• 方案 C：平衡了两者的优缺点\n\n推荐采用方案 C。',
    content: '基于我的分析，推荐以下解决方案：\n\n**核心思路**：采用分层架构，将问题分解为独立模块处理。\n\n**具体步骤**：\n1. 定义清晰的接口规范\n2. 实现核心逻辑层\n3. 添加适当的错误处理\n4. 进行测试验证\n\n这样可以保证系统的稳定性和可维护性。',
  },
]

export async function sendMessage(
  _conversationId: string,
  _content: string,
  onEvent: (e: StreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  // 20% 概率模拟报错
  if (Math.random() < 0.2) {
    await new Promise((r) => setTimeout(r, 600))
    if (signal?.aborted) return
    onEvent({ type: 'error', content: '服务暂时不可用，请稍后重试。（错误码：502 Bad Gateway）' })
    return
  }

  const mock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]

  // 阶段 1：思考
  onEvent({ type: 'thinking', content: '' })
  await new Promise((r) => setTimeout(r, 300))
  if (signal?.aborted) return
  await streamText(mock.thinking, 'thinking', onEvent, signal, 12)
  if (signal?.aborted) return

  // 阶段 2：分析
  await new Promise((r) => setTimeout(r, 200))
  if (signal?.aborted) return
  onEvent({ type: 'reasoning', content: '' })
  await streamText(mock.reasoning, 'reasoning', onEvent, signal, 14)
  if (signal?.aborted) return

  // 阶段 3：输出结果
  await new Promise((r) => setTimeout(r, 200))
  if (signal?.aborted) return
  await streamText(mock.content, 'content', onEvent, signal, 20)

  onEvent({ type: 'done', content: '' })
}
