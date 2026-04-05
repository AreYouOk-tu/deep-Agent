import { useCallback } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { ImageUploader } from './ImageUploader'
import { ImagePreview } from './ImagePreview'
import { ImageChatPanel } from './ImageChatPanel'
import { RotateCcw } from 'lucide-react'

export function EditorLayout() {
  const originalImage = useEditorStore((s) => s.originalImage)
  const fileName = useEditorStore((s) => s.fileName)
  const uploadImage = useEditorStore((s) => s.uploadImage)
  const reset = useEditorStore((s) => s.reset)

  const handleImageLoad = useCallback((base64: string, name: string) => {
    uploadImage(base64, name)
  }, [uploadImage])

  // 未上传图片 → 显示上传界面
  if (!originalImage) {
    return <ImageUploader onImageLoad={handleImageLoad} />
  }

  // 已上传 → 左右分栏：左边预览，右边对话
  return (
    <div className="flex flex-col h-full">
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
        </div>
        <button
          onClick={reset}
          title="重新上传"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw size={14} />
          重新上传
        </button>
      </div>

      {/* 主区域：左右分栏 */}
      <div className="flex flex-1 min-h-0">
        {/* 左侧：图片预览 */}
        <div className="basis-[56%] min-w-0">
          <ImagePreview />
        </div>

        {/* 右侧：对话面板 */}
        <div className="basis-[44%] min-w-0 border-l border-gray-200">
          <ImageChatPanel />
        </div>
      </div>
    </div>
  )
}
