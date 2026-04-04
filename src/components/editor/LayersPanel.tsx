import { Eye, EyeOff, Lock, Unlock } from 'lucide-react'

interface LayerItem {
  id: string
  name: string
  type: string
  visible: boolean
  locked: boolean
}

interface LayersPanelProps {
  layers: LayerItem[]
  selectedLayerId: string | null
  onSelectLayer: (id: string) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
}

export function LayersPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
}: LayersPanelProps) {
  return (
    <div className="w-60 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          图层
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {layers.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-8">
            上传图片后，AI 将自动拆分图层
          </div>
        ) : (
          layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedLayerId === layer.id
                  ? 'bg-purple-50 ring-1 ring-purple-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <LayerTypeIcon type={layer.type} />
              <span className="flex-1 text-sm text-gray-700 truncate">{layer.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id) }}
                className="p-0.5 text-gray-400 hover:text-gray-600"
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id) }}
                className="p-0.5 text-gray-400 hover:text-gray-600"
              >
                {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function LayerTypeIcon({ type }: { type: string }) {
  const label = type === 'text' ? 'T' : type === 'image' ? 'I' : 'C'
  const colors = type === 'text'
    ? 'bg-blue-100 text-blue-600'
    : type === 'image'
      ? 'bg-green-100 text-green-600'
      : 'bg-orange-100 text-orange-600'

  return (
    <span className={`flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${colors}`}>
      {label}
    </span>
  )
}
