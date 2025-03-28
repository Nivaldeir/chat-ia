//@ts-nocheck
'use client'

import { type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAssistant } from '@ai-sdk/react'
import { ChatRequestOptions } from 'ai'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(false)
  const [previewTokenInput, setPreviewTokenInput] = useState('')
  const { status, messages, input, setInput, stop, append, submitMessage } =
    useAssistant({ api: '/api/chat', body: {
      assistant: id,
    }});
    const chatRequestOptions = async (options: ChatRequestOptions) => {
      if (IS_PREVIEW && !previewToken) {
        setPreviewTokenDialog(true);
        return null;
      }
    
      return submitMessage(options);
    };

  return (
    <>
    <div className={cn('pb-[200px] relative pt-4 md:pt-10', className)}>
      <div className='fixed top-0 left-0 right-0 h-1 z-10'>
        <ArrowLeft className='cursor-pointer' onClick={router.back}/>
      </div>
      {messages.length ? (
        <>
          <ChatList messages={messages} isLoading={status == "in_progress"}/>
          <ChatScrollAnchor trackVisibility={status === 'in_progress'} />
        </>
      ) : (
        <EmptyScreen setInput={setInput} />
      )}
    </div>
      <ChatPanel
        id={id}
        isLoading={status == "in_progress"}
        stop={stop}
        append={append}
        reload={chatRequestOptions}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your OpenAI Key</DialogTitle>
          <DialogDescription>
            If you have not obtained your OpenAI API key, you can do so by{' '}
            <a
              href="https://platform.openai.com/signup/"
              className="underline"
            >
              signing up
            </a>{' '}
            on the OpenAI website. This is only necessary for preview
            environments so that the open source community can test the app.
            The token will be saved to your browser&apos;s local storage under
            the name <code className="font-mono">ai-token</code>.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={previewTokenInput}
          placeholder="OpenAI API key"
          onChange={e => setPreviewTokenInput(e.target.value)}
        />
        <DialogFooter className="items-center">
          <Button
            onClick={() => {
              setPreviewToken(previewTokenInput)
              setPreviewTokenDialog(false)
            }}
          >
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
