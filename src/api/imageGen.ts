import { client } from './client'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface ImageGenResult {
  image_url: string
  optimized_prompt: string
  style: string | null
}

/**
 * 调用后端文生图接口
 * Claude 优化提示词 + 通义万相生成图片
 */
export async function generateImage(
  prompt: string,
  style?: string,
): Promise<ImageGenResult> {
  const res = await client.post<ApiResponse<ImageGenResult>>('/ai/image/generate', {
    prompt,
    style: style || undefined,
  })
  if (res.code !== 0) throw new Error(res.message)
  return res.data
}
