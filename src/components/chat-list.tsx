import { type Message } from 'ai'

import { ChatMessage } from '@/components/chat-message'

export interface ChatList {
  messages: Message[]
  isLoading?: boolean
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className='mb-3'>
          <ChatMessage message={message} />
        </div>
      ))}
    </div>
  )
}
