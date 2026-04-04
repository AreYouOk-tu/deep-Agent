import { useState } from 'react'
import { ImageUploader } from './ImageUploader'
import { EditorToolbar } from './EditorToolbar'
import { CanvasArea } from './CanvasArea'
import { LayersPanel } from './LayersPanel'

export function EditorLayout() {
  const [imageData, setImageData] = useState<string | null>(null)
  const [_fileName, setFileName] = useState<string>('')

  const handleImageLoad = (base64: string, name: string) => {
    setImageData(base64)
    setFileName(name)
  }

  // 未上传图片时显示上传区域
  if (!imageData) {
    return <ImageUploader onImageLoad={handleImageLoad} />
  }

  // 已上传图片，显示编辑器界面
  return (
    <div className="flex flex-col h-full">
      <EditorToolbar
        onExport={() => { /* Phase 7 */ }}
        onUndo={() => { /* Phase 2 */ }}
        onRedo={() => { /* Phase 2 */ }}
      />
      <div className="flex flex-1 min-h-0">
        <CanvasArea imageData={imageData} />
        <LayersPanel
          layers={[]}
          selectedLayerId={null}
          onSelectLayer={() => {}}
          onToggleVisibility={() => {}}
          onToggleLock={() => {}}
        />
      </div>
    </div>
  )
}
