'use client'

import React, { useState } from 'react';
import { mockRecommendedUsers, useChat } from '@/contexts/ChatContext';
import { ChatRoom, ChatUser } from '@/types/chat';
import { MagnifyingGlass, PencilSimpleLineIcon, SealCheckIcon, XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { XCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { useTheme } from 'next-themes';

interface ChatListProps {
  onSelectRoom: (room: ChatRoom) => void;
}



// Helper function to render avatar
export const renderAvatar = (user: ChatUser, size: 'sm' | 'md' = 'md') => {
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  if (user.avatar) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0`}>
        <Image
          src={user.avatar}
          alt={user.name}
          width={size === 'sm' ? 32 : 40}
          height={size === 'sm' ? 32 : 40}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
      {user.name.charAt(0)}
    </div>
  );
};

// Helper function to get role badge styling
export const getRoleBadge = (role?: string, verified?: boolean) => {
  if (!role) return null;

  const roleConfig = {
    exhibition: {
      label: 'Exhibition',
    },
    artist: {
      label: 'Artist',
    },
    friend: {
      label: 'Friend',
    },
    user: {
      label: 'User',
    }
  };

  const config = roleConfig[role as keyof typeof roleConfig];
  if (!config) return null;

  return (
    <div className="flex items-center gap-[6px]">
      <span className={`inline-flex items-center rounded-full text-[14px] font-regular dark:text-white text-black`}>
        {config.label}
      </span>
      {verified && (
        <SealCheckIcon size={14} weight="fill" color="#9C27B0" />
      )}
    </div>
  );
};

// Helper function to format time ago
const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export default function ChatList({ onSelectRoom }: ChatListProps) {
  const { rooms, searchUsers, createRoom } = useChat();
  const [newChatQuery, setNewChatQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateRoom = (user: ChatUser) => {
    createRoom([user]);
    setShowNewChat(false);
    setNewChatQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col h-full dark:bg-black/90 bg-white/90 backdrop-blur-sm rounded-xl p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        {showNewChat ?

          <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#9C27B0] mb-2">New chat</h2>
              {darkMode ? (
                <XCircleIcon onClick={() => {
                  setShowNewChat(false);
                  setNewChatQuery('');
                  setSearchResults([]);
                }} size={24} weight="fill" color="#fff" className="cursor-pointer text-black" />
              ) : (
                <XCircleIcon onClick={() => {
                  setShowNewChat(false);
                  setNewChatQuery('');
                  setSearchResults([]);
                }} size={24} weight="fill" color="#9C27B0" className="cursor-pointer text-white" />
              )}
          </div>
          : <h2 className="text-lg font-semibold text-[#9C27B0] mb-2">Artverse Chats</h2>}

        {/* Start new chat entry */}
        {!showNewChat && (
          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() => setShowNewChat(true)}
              className="w-full flex items-center gap-3 p-[8px] mb-[11px] text-left hover:bg-gray-50 dark:hover:bg-black rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#9C27B0]  dark:text-white text-black grid place-items-center">
                <PencilSimpleLineIcon size={16} weight="fill" color="#fff" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[14px] dark:text-white text-black">Start new chat</div>
              </div>
            </button>
          </div>
        )}

        {/* New Chat Section (only shows after click) */}
        {showNewChat && (
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9C27B0]" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={newChatQuery}
                  onChange={(e) => {
                    setNewChatQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-white/20 bg-white dark:text-white text-black text-sm"
                />
              </div>

            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[14px] font-regular dark:text-white text-black mb-2">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-black rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleCreateRoom(user)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {renderAvatar(user, 'md')}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-sm truncate">{user.name}</div>

                      </div>
                      {getRoleBadge(user.role, user.verified)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 ">
        {!showNewChat && (
          rooms.length === 0 ? (
            <div className="text-center  py-8 dark:text-white text-black">
              <p>No conversations yet</p>
              <p className="text-[14px] dark:text-white text-black">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-[14px] font-regular dark:text-white text-black mb-[11px]">Your messages</h2>
              {rooms.map((room) => {
                // Get the other participant for direct messages
                const otherParticipant = room.participants.find(p => p.id !== 'current-user-id'); // Replace with actual current user ID

                return (
                  <div
                    key={room.id}
                    className="flex items-center gap-[11px] p-3 hover:bg-white dark:hover:bg-black rounded-lg cursor-pointer transition-colors"
                    onClick={() => onSelectRoom(room)}
                  >
                    {otherParticipant ? renderAvatar(otherParticipant, 'md') : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center dark:text-white text-black font-medium">
                        {room.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate dark:text-white text-black">{room.name}</h4>
                          {otherParticipant && getRoleBadge(otherParticipant.role, otherParticipant.verified)}
                        </div>
                        <div className="flex items-center gap-2">
                          {room.lastMessage && (
                            <span className="text-[12px] font-regular dark:text-white text-black">
                              {getTimeAgo(room.lastMessage.timestamp)}
                            </span>
                          )}
                          {room.unreadCount > 0 && (
                            <span className="bg-purple-600 dark:text-white text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {room.lastMessage && (
                          <p className="text-[14px] font-regular dark:text-white text-black truncate flex-1">
                            {room.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
        {searchResults.length === 0 && (
          <div className="mb-4">
            <h3 className="text-[14px] font-regular dark:text-white text-black mt-[11px] mb-[11px]">Recommended</h3>
            <div className="space-y-2">
              {mockRecommendedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-black rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleCreateRoom(user)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {renderAvatar(user, 'md')}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-sm truncate">{user.name}</div>

                      </div>
                      {getRoleBadge(user.role, user.verified)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}