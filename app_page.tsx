'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from 'lucide-react'

export default function ChatComponent() {
  const [mounted, setMounted] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [],
    onFinish: (message) => {
      localStorage.setItem('chatMessages', JSON.stringify([...messages, message]))
    },
  })

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages')
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages)
      messages.push(...parsedMessages)
    }
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>AI Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">
              An error occurred. Please try again.
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}