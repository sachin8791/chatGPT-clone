'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
}

interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChats(data);
      setDbError(null);
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Set empty state if API fails
      setChats([]);
      setDbError('Database connection failed. Chat history will not be saved.');
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    fetchChatMessages(chatId);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
      await fetchChats();
      
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId || 'temp',
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatId: activeChatId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;
          setStreamingMessage(accumulatedContent);
        }
      }

      setStreamingMessage('');
      await fetchChats();
      
      if (!activeChatId) {
        const newChats = await fetch('/api/chats').then(res => res.json());
        const latestChat = newChats[0];
        setActiveChatId(latestChat._id);
        await fetchChatMessages(latestChat._id);
      } else {
        await fetchChatMessages(activeChatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {messages.length === 0 && !streamingMessage ? (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  ChatGPT Clone
                </h1>
                <p className="text-gray-400 mb-8">
                  Built with Next.js, TypeScript, and OpenAI
                </p>
                
                {dbError && (
                  <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-2xl mx-auto">
                    <p className="text-red-300 text-sm">{dbError}</p>
                    <p className="text-red-400 text-xs mt-2">
                      Please check your MongoDB connection and restart the server.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-gray-800 rounded-lg glass">
                    <h3 className="font-semibold mb-2">💬 Natural Conversation</h3>
                    <p className="text-sm text-gray-400">Chat naturally with AI</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg glass">
                    <h3 className="font-semibold mb-2">📝 Code Support</h3>
                    <p className="text-sm text-gray-400">Syntax highlighting for code</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg glass">
                    <h3 className="font-semibold mb-2">⚡ Real-time</h3>
                    <p className="text-sm text-gray-400">Streaming responses</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                
                {streamingMessage && (
                  <MessageBubble
                    message={{
                      _id: 'streaming',
                      chatId: 'temp',
                      role: 'assistant',
                      content: streamingMessage,
                      createdAt: new Date().toISOString(),
                    }}
                    isLoading={true}
                  />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
}
