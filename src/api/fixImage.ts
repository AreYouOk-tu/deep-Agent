import { client } from './client'
import type { EditImageResponse } from '@/types/editor'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 调用后端 AI 编辑图片
 * 混合方案：Claude Vision 理解意图 + Pillow 文字精确渲染 + 通义万相 Inpainting
 */
export async function editImage(
  imageBase64: string,
  prompt: string,
  logoImage?: string,
): Promise<EditImageResponse> {
  const res = await client.post<ApiResponse<EditImageResponse>>('/fix-image/edit', {
    image: imageBase64,
    prompt,
    logo_image: logoImage || undefined,
  })
  if (res.code !== 0) throw new Error(res.message)
  return res.data
}
