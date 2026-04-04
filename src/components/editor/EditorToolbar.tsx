import { Undo2, Redo2, ZoomIn, ZoomOut, Download, MousePointer2, Hand } from 'lucide-react'

interface EditorToolbarProps {
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
}

export function EditorToolbar({ onExport, onUndo, onRedo }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
      {/* 左侧：工具 */}
      <div className="flex items-center gap-1">
        <ToolButton icon={<MousePointer2 size={16} />} label="选择" active />
        <ToolButton icon={<Hand size={16} />} label="平移" />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton icon={<Undo2 size={16} />} label="撤销" onClick={onUndo} />
        <ToolButton icon={<Redo2 size={16} />} label="重做" onClick={onRedo} />
      </div>

      {/* 中间：缩放 */}
      <div className="flex items-center gap-1">
        <ToolButton icon={<ZoomOut size={16} />} label="缩小" />
        <span className="text-xs text-gray-500 w-12 text-center">100%</span>
        <ToolButton icon={<ZoomIn size={16} />} label="放大" />
      </div>

      {/* 右侧：导出 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
        >
          <Download size={14} />
          导出图片
        </button>
      </div>
    </div>
  )
}

function ToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      {icon}
    </button>
  )
}
