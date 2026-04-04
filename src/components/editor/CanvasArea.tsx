interface CanvasAreaProps {
  imageData: string
}

export function CanvasArea({ imageData }: CanvasAreaProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={imageData}
          alt="Uploaded"
          className="max-w-full max-h-[calc(100vh-180px)] object-contain"
        />
        {/* Fabric.js canvas will replace this in Phase 4 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-500">Canvas 编辑区（即将接入 Fabric.js）</span>
          </div>
        </div>
      </div>
    </div>
  )
}
