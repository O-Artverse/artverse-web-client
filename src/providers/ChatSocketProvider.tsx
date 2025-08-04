'use client';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import socketClient from '@/lib/socket-client';
import { getCookie } from '@/utils/cookieUtils';
import { useGetExceptionSocket } from '@/hooks/sockets/exception.socket';
import { showToast } from '@/utils/showToast';
import { ErrorCloseIcon } from '@/components/common/icons/ErrorIcon';
import { getClientCookie } from '@/utils/cookieClientUltils';
import { getServerCookie } from '@/utils/cookieServerUltils';

interface ChatSocketContextType {
  isConnected: boolean;
}

const ChatSocketContext = createContext<ChatSocketContextType>({
  isConnected: false,
});

interface ChatSocketProviderProps {
  chatId: number;
  children: ReactNode;
}

const ChatSocketProvider: FC<ChatSocketProviderProps> = ({ chatId, children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useGetExceptionSocket({
    callback: (error) => {
      showToast({
        title: error?.message ?? 'A websocket error occurred',
        color: 'error',
        icon: <ErrorCloseIcon className="text-danger-300" />,
      });
    },
  });

  const connectSocket = async () => {
    const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    let accessToken = null;

    if (isClient) {
      accessToken = getClientCookie('accessToken');
    } else {
      accessToken = await getServerCookie('accessToken');
    }

    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    const socket = await socketClient.connect(+chatId, accessToken);

    if (socket?.connected) {
      setIsConnected(true);
    }

    socketClient.on('connect', () => setIsConnected(true));
    socketClient.on('disconnect', () => setIsConnected(false));

    return () => {
      socketClient.off('connect');
      socketClient.off('disconnect');
    };
  };

  useEffect(() => {
    connectSocket();
  }, [chatId]);

  return (
    <>
      <ChatSocketContext.Provider value={{ isConnected }}>{children}</ChatSocketContext.Provider>
    </>
  );
};

export const useChatSocket = () => useContext(ChatSocketContext);

export default ChatSocketProvider;
