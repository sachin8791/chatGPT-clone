'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export default function Sidebar({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat 
}: SidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(chatId);
    await onDeleteChat(chatId);
    setDeletingId(null);
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus size={20} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 pb-4">
          {chats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat._id?.toString()}
                  onClick={() => onSelectChat(chat._id?.toString() || '')}
                  className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeChatId === chat._id?.toString()
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat._id?.toString() || '', e)}
                      className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all duration-200 ${
                        deletingId === chat._id?.toString() ? 'opacity-100' : ''
                      }`}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
