import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Send, Square, Paperclip, Mic } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStreamChat } from '@/hooks/useStreamChat'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { useChatStore } from '@/stores/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const { currentConversation, isStreaming } = useChatStore()
  const { send, stop } = useStreamChat()
  const { isListening, isSupported, start } = useVoiceInput()

  const handleSend = async () => {
    if (!input.trim() || !currentConversation || isStreaming) return
    const text = input.trim()
    setInput('')
    await send(currentConversation.id, text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoice = () => {
    start((text) => setInput((prev) => prev + text))
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Paperclip size={20} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isStreaming}
        />
        {isSupported && (
          <button
            onClick={handleVoice}
            disabled={isListening || isStreaming}
            className={`p-2 rounded-lg ${isListening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <Mic size={20} />
          </button>
        )}
        {isStreaming ? (
          <Button onClick={stop} variant="secondary" size="md">
            <Square size={18} />
          </Button>
        ) : (
          <Button onClick={handleSend} disabled={!input.trim() || !currentConversation} size="md">
            <Send size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
