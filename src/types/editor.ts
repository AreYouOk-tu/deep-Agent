// ============ 对话式改图类型 ============

export interface EditMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string              // AI 返回的结果图片 base64
  attachment?: { name: string; base64: string }  // 用户上传的附件（如 logo）
  status?: 'thinking' | 'processing' | 'done' | 'error'
  error?: string
  timestamp: string
}

export interface EditImageResponse {
  resultImage: string         // 修改后图片 base64
  description: string         // AI 描述做了什么修改
}
