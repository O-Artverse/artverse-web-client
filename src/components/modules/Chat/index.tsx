'use client'
import { useChat } from '@/contexts/ChatContext'
import ChatList from './ChatList'
import ChatRoom from './ChatRoom'

export default function ChatModule() {
  const { activeRoom, setActiveRoom } = useChat()
  return activeRoom
    ? <ChatRoom roomId={activeRoom.id} onBack={() => setActiveRoom(null)} />
    : <ChatList onSelectRoom={(room) => setActiveRoom(room)} />
}
