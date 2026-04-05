import { create } from 'zustand'
import type { EditMessage } from '@/types/editor'

interface ImageEditState {
  // 图片状态
  originalImage: string | null
  fileName: string | null
  currentImage: string | null
  imageHistory: string[]
  historyIndex: number

  // 对话状态
  messages: EditMessage[]
  isProcessing: boolean

  // Actions
  uploadImage: (base64: string, fileName: string) => void
  addUserMessage: (content: string) => void
  addAIMessage: (content: string, resultImage?: string) => void
  updateAIMessage: (patch: Partial<EditMessage>) => void
  setProcessing: (v: boolean) => void
  setCurrentImage: (image: string) => void
  undo: () => void
  redo: () => void
  downloadImage: () => void
  reset: () => void
}

export const useEditorStore = create<ImageEditState>((set, get) => ({
  originalImage: null,
  fileName: null,
  currentImage: null,
  imageHistory: [],
  historyIndex: -1,
  messages: [],
  isProcessing: false,

  uploadImage: (base64, fileName) => {
    set({
      originalImage: base64,
      fileName,
      currentImage: base64,
      imageHistory: [base64],
      historyIndex: 0,
      messages: [],
      isProcessing: false,
    })
  },

  addUserMessage: (content) => {
    const msg: EditMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, msg] }))
  },

  addAIMessage: (content, resultImage) => {
    const msg: EditMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content,
      image: resultImage,
      status: 'thinking',
      timestamp: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, msg] }))
  },

  updateAIMessage: (patch) => {
    set((s) => {
      const messages = [...s.messages]
      const lastIdx = messages.length - 1
      if (lastIdx < 0 || messages[lastIdx].role !== 'assistant') return s

      messages[lastIdx] = { ...messages[lastIdx], ...patch }

      // 如果 AI 返回了新图片且状态为 done，加入历史
      const updated = messages[lastIdx]
      if (patch.status === 'done' && updated.image) {
        const history = s.imageHistory.slice(0, s.historyIndex + 1)
        history.push(updated.image)
        return {
          messages,
          currentImage: updated.image,
          imageHistory: history,
          historyIndex: history.length - 1,
        }
      }

      return { messages }
    })
  },

  setProcessing: (isProcessing) => set({ isProcessing }),

  setCurrentImage: (image) => set({ currentImage: image }),

  undo: () => {
    const { imageHistory, historyIndex } = get()
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    set({
      currentImage: imageHistory[newIndex],
      historyIndex: newIndex,
    })
  },

  redo: () => {
    const { imageHistory, historyIndex } = get()
    if (historyIndex >= imageHistory.length - 1) return
    const newIndex = historyIndex + 1
    set({
      currentImage: imageHistory[newIndex],
      historyIndex: newIndex,
    })
  },

  downloadImage: () => {
    const { currentImage, fileName } = get()
    if (!currentImage) return
    const link = document.createElement('a')
    link.download = `${fileName?.replace(/\.\w+$/, '') ?? 'edited'}_output.png`
    link.href = currentImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  reset: () => set({
    originalImage: null,
    fileName: null,
    currentImage: null,
    imageHistory: [],
    historyIndex: -1,
    messages: [],
    isProcessing: false,
  }),
}))
