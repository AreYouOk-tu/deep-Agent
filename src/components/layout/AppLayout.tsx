import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { EditorLayout } from '@/components/editor/EditorLayout'

export function AppLayout() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()
  const currentAgent = useChatStore((s) => s.currentAgent)

  const isImageEditor = currentAgent?.type === 'image-editor'

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden" style={{ contain: 'layout' }}>
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative z-20 h-full transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-72 ${!sidebarOpen ? 'md:w-0 md:overflow-hidden' : ''}
      `}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white md:hidden flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-gray-900">
            {isImageEditor ? 'AI 智能改图' : 'AI Agent'}
          </span>
        </div>

        <div className="hidden md:flex items-center px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={18} />
          </button>
          {isImageEditor && (
            <span className="ml-3 text-sm font-medium text-gray-700">AI 智能改图</span>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {isImageEditor ? <EditorLayout /> : <ChatWindow />}
        </div>
      </div>
    </div>
  )
}
