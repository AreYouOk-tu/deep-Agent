import { Undo2, Redo2, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function ImagePreview() {
  const currentImage = useEditorStore((s) => s.currentImage)
  const imageHistory = useEditorStore((s) => s.imageHistory)
  const historyIndex = useEditorStore((s) => s.historyIndex)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const downloadImage = useEditorStore((s) => s.downloadImage)

  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < imageHistory.length - 1

  // 图片加载后自适应容器
  useEffect(() => {
    setZoom(1)
  }, [currentImage])

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25))
  const handleResetZoom = () => setZoom(1)

  if (!currentImage) return null

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="撤销"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="重做"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 size={16} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button onClick={handleZoomOut} title="缩小" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs text-gray-500 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} title="放大" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleResetZoom} title="重置缩放" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
            <RotateCcw size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">
            版本 {historyIndex + 1}/{imageHistory.length}
          </span>
          <button
            onClick={downloadImage}
            title="下载图片"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Download size={14} />
            下载
          </button>
        </div>
      </div>

      {/* 图片预览区 */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-auto p-4"
      >
        <img
          ref={imgRef}
          src={currentImage}
          alt="Preview"
          className="max-w-none shadow-lg rounded-lg transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          draggable={false}
        />
      </div>
    </div>
  )
}
