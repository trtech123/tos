"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Mic, MicOff, Plane } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function FullScreenChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Mark that chat has started
    if (!hasStartedChat) {
      setHasStartedChat(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from ChatGPT')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "מצטער, לא הצלחתי להבין. אנא נסה שוב.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשלוח את ההודעה. אנא נסה שוב.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)

        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      toast({
        title: "מקליט",
        description: "מקליט את הקול שלך...",
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להתחיל הקלטה. אנא בדוק את הרשאות המיקרופון.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()

      if (data.text) {
        setInput(data.text)
        toast({
          title: "הקלטה הצליחה",
          description: "הטקסט התקבל מההקלטה",
        })
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לתמלל את ההקלטה. אנא נסה שוב.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Helper function to render message content with clickable links
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }

      const linkText = match[1]
      const linkUrl = match[2]
      parts.push(
        <Link
          key={match.index}
          href={linkUrl}
          className="underline font-semibold hover:opacity-80 inline-block"
        >
          {linkText}
        </Link>
      )

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return parts.length > 0 ? parts : content
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Welcome Screen - Before Chat Starts */}
      {!hasStartedChat && messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6" dir="rtl">
          <div className="max-w-3xl w-full space-y-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Plane className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-foreground">לאן תרצה לטוס?</h2>
              <p className="text-lg text-muted-foreground">ספר לי לאן תרצה לטוס ואעזור לך למצוא את הטיסה המושלמת</p>
            </div>

            {/* Centered Input Box */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='לדוגמה: "אני רוצה לטוס לפריז בחודש הבא"'
                  className="flex-1 h-14 text-base px-6"
                  disabled={isRecording}
                  autoFocus
                />
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  className={`h-14 w-14 ${isRecording ? "animate-pulse" : ""}`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button onClick={handleSend} size="icon" disabled={!input.trim() || isRecording} className="h-14 w-14">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Example prompts */}
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
              <button
                onClick={() => setInput("אני רוצה לטוס לפריז")}
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                טיסה לפריז
              </button>
              <button
                onClick={() => setInput("מה המחיר לניו יורק?")}
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                מחירים לניו יורק
              </button>
              <button
                onClick={() => setInput("אני רוצה לטוס ליוון בקיץ")}
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                חופשה ביוון
              </button>
              <button
                onClick={() => setInput("המלץ לי על יעד לחופשה")}
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                המלצה על יעד
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages - After Chat Starts */}
      {hasStartedChat && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6" dir="rtl">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-2">
                <div
                  className={`rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                      : "bg-card text-card-foreground border max-w-[90%]"
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{renderMessageContent(message.content)}</p>
                </div>
                <p className={`text-xs ${message.role === "user" ? "text-right" : "text-left"} text-muted-foreground px-2`}>
                  {message.timestamp.toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl px-6 py-4 bg-card border">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input - Only show at bottom when chat has started */}
      {hasStartedChat && (
        <div className="border-t bg-background p-4 flex-shrink-0" dir="rtl">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="הקלד הודעה..."
                className="flex-1 h-12 text-base"
                disabled={isRecording}
              />
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                className={`h-12 w-12 ${isRecording ? "animate-pulse" : ""}`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button onClick={handleSend} size="icon" disabled={!input.trim() || isRecording} className="h-12 w-12">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
