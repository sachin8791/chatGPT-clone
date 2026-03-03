'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-800 bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="relative w-full max-w-3xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled}
              className="w-full px-4 py-3 pr-16 bg-slate-800 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 scrollbar-hide"
              rows={1}
              style={{ 
                minHeight: '56px', 
                maxHeight: '200px',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="transform rotate-90" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </form>
    </div>
  );
}
