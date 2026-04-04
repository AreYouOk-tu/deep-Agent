import type { Agent } from '@/types'

// Mock data
export const mockAgents: Agent[] = [
  {
    id: 'image-editor',
    name: 'AI 智能改图',
    avatar: '🎨',
    description: '上传图片，AI 智能拆分图层并编辑',
    capabilities: ['图片分析', '图层拆分', '可视化编辑', '导出图片'],
    type: 'image-editor',
    createdAt: new Date().toISOString(),
  },
  {
    id: '1',
    name: 'AI 智能生图',
    avatar: '🖼️',
    description: '通过文字描述，AI 智能生成图片',
    capabilities: ['文生图', '图生图', '风格转换'],
    type: 'chat',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '陪伴助手',
    avatar: '💬',
    description: '你的智能陪伴助手，随时为你解答问题',
    capabilities: ['聊天', '问答', '写作'],
    type: 'chat',
    createdAt: new Date().toISOString(),
  },
]

export async function getAgents(): Promise<Agent[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAgents), 300)
  })
}
