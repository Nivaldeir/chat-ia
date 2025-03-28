import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // Import the desired highlight.js theme
import { ChatMessageActions } from './chat-message-actions';
import { IconOpenAI, IconUser } from './ui/icons';
import { Loader2 } from 'lucide-react';

export function ChatMessage({ message, isLoading = false }: any) {
  return (
    <div className="group relative mb-4 flex items-start md:-ml-12">
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow ${message.role === 'user'
          ? 'bg-background'
          : 'bg-primary text-primary-foreground'
          }`}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {
          isLoading && <Loader2 className='animate-spin'/>
        }
        <div className="prose break-words dark:prose-invert prose-p:leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              //@ts-ignore
              code({ node, inline, className, children, ...props }) {
                return inline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  //@ts-ignore
                  <pre className={className} {...props}>
                    <code>{children}</code>
                  </pre>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
