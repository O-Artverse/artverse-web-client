import { SocketCallback } from '@/types/socket';
import socketClient from '@/lib/socket-client';

export const onException = (callback: SocketCallback<any>) => {
  try {
    socketClient.on('exception', callback);

    return () => socketClient.off('exception', callback);
  } catch (error) {
    console.error('Error adding exception listener:', error);
    throw new Error('Failed to listen for exception');
  }
};
