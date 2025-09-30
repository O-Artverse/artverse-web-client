'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { ChatMessage, FavoriteArtwork } from '@/types/chat';
import { CaretLeftIcon, SmileyIcon, ArrowBendDoubleUpLeftIcon, XIcon, PlusCircleIcon, PaperPlaneRightIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import FavoriteArtworkSelector from './FavoriteArtworkSelector';
import { getRoleBadge, renderAvatar } from './ChatList';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/store/hooks';

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
}

export default function ChatRoom({ onBack }: ChatRoomProps) {
  const {
    activeRoom,
    messages,
    sendMessage,
    sendArtwork,
    addReaction,
    showFavoriteArtworks,
    setShowFavoriteArtworks,
    getFavoriteArtworks
  } = useChat();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.id || '';

  const [messageInput, setMessageInput] = useState('');
  const [artworks, setArtworks] = useState<FavoriteArtwork[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  useEffect(() => {
    const loadArtworks = async () => {
      const data = await getFavoriteArtworks();
      setArtworks(data);
    };
    loadArtworks();
  }, [getFavoriteArtworks]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput.trim(), 'TEXT', replyingTo?.id);
      setMessageInput('');
      setReplyingTo(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendArtwork = (artwork: FavoriteArtwork) => {
    sendArtwork(artwork);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const findMessageById = (messageId: string): ChatMessage | null => {
    return messages.find(msg => msg.id === messageId) || null;
  };

  const handleShowEmojiPicker = (messageId: string) => {
    setShowEmojiPicker(showEmojiPicker === messageId ? null : messageId);
  };

  const handleEmojiReaction = (messageId: string, emoji: string): void => {
    addReaction(messageId, emoji);
    setShowEmojiPicker(null);
  };  

  if (!activeRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }
  
  return (
    <div onClick={() => setShowEmojiPicker(null)} className="flex flex-col h-full dark:bg-[#1E1B26]/90 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-[10px]">
          {darkMode ? (
            <CaretLeftIcon onClick={onBack} size={20} color='#fff' className='cursor-pointer' />
          ) : (
            <CaretLeftIcon onClick={onBack} size={20} color='#000' className='cursor-pointer' />
          )}
         
          {renderAvatar(activeRoom.participants[0], 'sm')}
          <div>
            <h3 className="font-medium">{activeRoom.name}</h3>
            <div className="flex items-center gap-1">
              {getRoleBadge(activeRoom.participants[0].role, activeRoom.participants[0].verified)}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showDate = !prevMessage || 
                new Date(message.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();
              
              return (
                <div key={message.id} >
                  {showDate && (
                    <div className="flex justify-center my-4 ">
                      <span className="text-xs dark:text-white/60 text-black/60 px-3 py-1 rounded-full">
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    currentUserId={currentUserId}
                    onReply={handleReply}
                    showAvatar={!prevMessage || prevMessage.senderId !== message.senderId}
                    findMessageById={findMessageById}
                    showEmojiPicker={showEmojiPicker === message.id}
                    onShowEmojiPicker={() => handleShowEmojiPicker(message.id)}
                    onEmojiReaction={handleEmojiReaction}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 dark:bg-black/20 bg-white/20 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
             {darkMode ? (
                  <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-white/60" />
                ) : (
                  <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-black/60" />
                )}
              <span className="text-sm text-gray-600">Replying to {replyingTo.sender?.name || 'Unknown'}</span>
              <span className="text-xs text-gray-500 truncate max-w-[200px]">
                {replyingTo.content}
              </span>
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon size={16} className='text-gray-500' />
            </button>
          </div>
        </div>
      )}

      {/* Favorite Artwork Selector */}
      {showFavoriteArtworks && (
        <FavoriteArtworkSelector
          artworks={artworks}
          onSendArtwork={handleSendArtwork}
          onClose={() => setShowFavoriteArtworks(false)}
        />
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 ">
        <div className="flex items-center gap-2  ">
          <button 
            className="p-2 bg-[#9C27B0] rounded-full"
            onClick={() => setShowFavoriteArtworks(true)}
          >
            <PlusCircleIcon size={20} className="text-white" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={replyingTo ? `Reply to ${replyingTo.sender?.name || 'Unknown'}...` : "Enter messages..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 pr-12 text-[14px] ts dark:text-white rounded-[12px] dark:bg-black bg-white shadow-sm shadow-[#000000]/25 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500 dark:placeholder:text-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2  text-white rounded-full  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperPlaneRightIcon size={16} className='dark:text-white text-black hover:text-[#9C27B0]' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  onReply: (message: ChatMessage) => void;
  showAvatar: boolean;
  findMessageById: (id: string) => ChatMessage | null;
  showEmojiPicker: boolean;
  onShowEmojiPicker: () => void;
  onEmojiReaction: (messageId: string, emoji: string) => void;
}

function MessageBubble({ message, currentUserId, onReply, showAvatar, findMessageById, showEmojiPicker, onShowEmojiPicker, onEmojiReaction }: MessageBubbleProps) {
  const isOwn = message.senderId === currentUserId;
  const isReply = !!message.replyTo;
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const reactions = message.reactions || [];
  
  const originalMessage = isReply ? findMessageById(message.replyTo!) : null;
  
  const getImageDimensions = (artwork: any) => {
    const maxSize = 250;
    
    if (artwork.ratio) {
      if (artwork.ratio > 1) {
        return {
          width: maxSize,
          height: maxSize / artwork.ratio
        };
      } else {
        return {
          width: maxSize * artwork.ratio,
          height: maxSize
        };
      }
    }
    
    return { width: 200, height: 150 };
  };
  
  const emojis = ['❤️', '😂', '😍', '😮', '👍', '🔥'];
  
  const handleEmojiClick = (emoji: string) => {
    onEmojiReaction(message.id, emoji);
  };
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`w-full max-w-[85%] ${isOwn ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
        {!isOwn && showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            {renderAvatar({
              id: message.senderId,
              name: message.sender?.name || 'Unknown',
              avatar: message.sender?.avatar,
              status: 'online'
            }, 'sm')}
            <span className="text-xs text-gray-500">{message.sender?.name || 'Unknown'}</span>
          </div>
        )}
        
        <div className="relative group">
        {isReply && originalMessage ? (
          <div
            className={` px-4 py-3  rounded-2xl relative shadow-sm shadow-[#000000]/25 text-[14px] ${
              isOwn
                ? 'bg-white '
                : 'dark:text-white text-black'
            }`}
            style={{
              backgroundColor: isOwn ? darkMode ? 'rgba(255, 255, 255, 0.2)' : '#fff' : 'rgba(210, 67, 207, 0.2)'
            }}
          >
            <div className="space-y-2 ">
              <div className={`p-2 rounded-lg ${isOwn ? 'bg-[#D243CF]/20' : 'dark:bg-white/10 bg-white'} w-fit`}>
                <p className={`text-[14px] dark:text-white text-black`}>
                    {originalMessage.content}
                  </p>
                </div>
                
                <p className={`text-[14px] ${isOwn ? 'text-black dark:text-white' : 'dark:text-white text-black'}`}>
                  {message.content}
                </p>
              </div>
          </div>
           ) : (
            <>
              {message.type === 'artwork' && message.artwork ? (
                    <Image
                      src={message.artwork.image}
                      alt={message.artwork.title}
                      width={getImageDimensions(message.artwork).width}
                      height={getImageDimensions(message.artwork).height}
                      className="rounded-lg object-cover"
                    />
              ) : (
                <div
                className={` px-4 py-3  rounded-2xl relative shadow-sm shadow-[#000000]/25 text-[14px] ${
                  isOwn
                    ? 'bg-white '
                    : 'dark:text-white text-black'
                }`}
                style={{
                  backgroundColor: isOwn ? darkMode ? 'rgba(255, 255, 255, 0.2)' : '#fff' : 'rgba(210, 67, 207, 0.2)'
                }}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              )}
            </>
          )}
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <>
              {/* Backdrop to close picker */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => onShowEmojiPicker()}
              />

              <div
                className={`absolute bottom-full mb-2 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-white/10 shadow-xl z-50 ${
                  isOwn ? 'right-0' : 'left-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-1.5">
                  <div className="flex gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-xl hover:bg-gray-100 dark:hover:bg-white/10 rounded-md p-1.5 transition-all hover:scale-110 active:scale-95"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Arrow indicator */}
                <div
                  className={`absolute top-full w-0 h-0 border-[6px] border-transparent ${
                    isOwn
                      ? 'right-3 border-t-white dark:border-t-[#1a1a1a]'
                      : 'left-3 border-t-white dark:border-t-[#1a1a1a]'
                  }`}
                  style={{ marginTop: '-1px' }}
                />
              </div>
            </>
          )}
          
          {/* Reaction and Reply Icons */}
          {!isOwn ? (
            <div className={`absolute top-[30%] -right-12 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="flex">
              <button 
                  className=" hover:bg-white hover:dark:bg-black rounded-full transition-colors"
                  onClick={() => onReply(message)}
                >
                  {darkMode ? (
                    <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-white/60" />
                  ) : (
                    <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-black/60" />
                  )}
                </button>
                <button 
                  className=" hover:bg-white hover:dark:bg-black rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowEmojiPicker();
                  }}
                >
                  {darkMode ? (
                    <SmileyIcon weight='fill' size={16} className="text-white/60" />
                  ) : (
                    <SmileyIcon weight='fill' size={16} className="text-black/60" />
                  )}
                </button>
             
              </div>
            </div>
            ) : (
              <div className={` absolute top-[30%] -left-12 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="flex">
              <button 
                  className=" hover:bg-white hover:dark:bg-black rounded-full transition-colors"
                  onClick={() => onReply(message)}
                >
                  {darkMode ? (
                    <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-white/60" />
                  ) : (
                    <ArrowBendDoubleUpLeftIcon weight='fill' size={16} className="text-black/60" />
                  )}
                </button>
                <button 
                  className=" hover:bg-white hover:dark:bg-black rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowEmojiPicker();
                  }}
                >
                  {darkMode ? (
                    <SmileyIcon weight='fill' size={16} className="text-white/60" />
                  ) : (
                    <SmileyIcon weight='fill' size={16} className="text-black/60" />
                  )}
                </button>
             
              </div>
            </div>
            )}
        </div>
        
        {/* Emoji Reactions */}
        {reactions.length > 0 && (
          <div className={`flex gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs"
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-600 dark:text-gray-300">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}