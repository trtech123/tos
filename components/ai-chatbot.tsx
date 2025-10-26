"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "שלום! אני עוזר הטיסות החכם שלך. איך אוכל לעזור לך היום?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
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
      // Send message to ChatGPT API
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

        // Stop all tracks to release the microphone
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
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }

      // Add the link
      const linkText = match[1]
      const linkUrl = match[2]
      parts.push(
        <Link
          key={match.index}
          href={linkUrl}
          className="underline font-semibold hover:opacity-80"
          onClick={() => setIsOpen(false)}
        >
          {linkText}
        </Link>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text after the last link
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return parts.length > 0 ? parts : content
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">עוזר טיסות AI</h3>
                <p className="text-xs opacity-90">מקוון</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30" dir="rtl">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[75%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{renderMessageContent(message.content)}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-4 py-2 bg-card border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-background" dir="rtl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="הקלד הודעה..."
                className="flex-1"
                disabled={isRecording}
              />
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                className={isRecording ? "animate-pulse" : ""}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSend} size="icon" disabled={!input.trim() || isRecording}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
