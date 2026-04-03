import { useState, useEffect, useRef } from 'react'

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognitionCtor) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognitionCtor()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
    }
  }, [])

  const start = (onResult: (text: string) => void) => {
    if (!recognitionRef.current) return

    recognitionRef.current.onresult = (event) => {
      const text = event.results[0][0].transcript
      onResult(text)
      setIsListening(false)
    }

    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.onend = () => setIsListening(false)

    recognitionRef.current.start()
    setIsListening(true)
  }

  const stop = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  return { isListening, isSupported, start, stop }
}
