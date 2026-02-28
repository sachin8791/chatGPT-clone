'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export default function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div
        className={`max-w-3xl px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white ml-12'
            : 'bg-gray-800 text-gray-100 mr-12 glass'
        } ${isLoading ? 'typing-animation' : ''}`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="text-sm text-gray-400">Assistant</span>
          </div>
        )}
        
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeContent = String(children).replace(/\n$/, '');
                  const inline = false;

                  if (!inline && language) {
                    return (
                      <div className="relative group">
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            onClick={() => copyToClipboard(codeContent)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            {copiedCode ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-300" />
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={language}
                          PreTag="div"
                          className="!bg-gray-900 !rounded-lg !p-4 !text-sm"
                          {...props}
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mb-3">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-bold mb-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-bold mb-3">{children}</h3>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 mb-3">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs opacity-60">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          {isUser && (
            <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
