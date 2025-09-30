import { io, Socket } from 'socket.io-client';

import { Nullable } from '@/utils/util';
import { QueuedEvent, QueuedListener, QueuedOff } from '@/types/socket';

class SocketClient {
  private socket: Nullable<Socket> = null;
  private connectionPromise: Nullable<Promise<Socket>> = null;
  private eventQueue: QueuedEvent[] = [];
  private onQueue: QueuedListener[] = [];
  private offQueue: QueuedOff[] = [];

  public connect(eventId: number, accessToken: string, namespace: string = '') {
    if (this.socket && this.socket.connected) {
      return Promise.resolve(this.socket);
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const socketBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = namespace ? `${socketBaseUrl}${namespace}` : socketBaseUrl;

      console.log('🔌 Connecting to:', url);
      console.log('🔑 Token length:', accessToken?.length || 0);

      this.socket = io(url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        reconnectionDelayMax: 5000,
        transports: ['websocket', 'polling'], // Try websocket first
        query: {
          eventId: eventId,
        },
        auth: {
          token: `Bearer ${accessToken}`,
        },
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected to:', url);
        this.flushQueues();
        resolve(this.socket as Socket);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        console.error('Full error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
      });
    });

    return this.connectionPromise;
  }

  public disconnect(): void {
    if (!this.socket?.connected) {
      throw new Error('Socket is not connected. Please connect first.');
    }

    console.log('Disconnecting socket...');
    this.socket.disconnect();
    this.socket = null;
    this.connectionPromise = null;
  }

  public getSocket(): Nullable<Socket> {
    return this.socket;
  }

  public emit<T>(event: string, data?: T) {
    if (!this.socket?.connected) {
      this.eventQueue.push({ event, data });

      return;
    }

    if (!data) {
      this.socket.emit(event);

      return;
    }

    this.socket.emit(event, data);
  }

  public on<T>(event: string, callback: (data: T) => void) {
    if (!this.socket?.connected) {
      this.onQueue.push({ event, callback });

      return;
    }

    const listeners = this.socket.listeners(event);
    const isAlreadyListening = listeners.some((l) => l.name === callback.name);

    if (isAlreadyListening) {
      return;
    }

    this.socket.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket?.connected) {
      this.offQueue.push({ event, callback });

      return;
    }

    this.socket.off(event, callback);
  }

  private flushQueues() {
    console.log(`Flushing ${this.eventQueue.length} emits`);
    this.eventQueue.forEach(({ event, data }) => {
      if (!data) {
        this.socket?.emit(event);

        return;
      }

      this.socket?.emit(event, data);
    });

    console.log(`Flushing ${this.onQueue.length} listeners`);
    this.onQueue.forEach(({ event, callback }) => {
      if (this.socket?.listeners(event).some((l) => l.name === callback.name)) {
        return;
      }

      this.socket?.on(event, callback);
    });

    console.log(`Flushing ${this.offQueue.length} off calls`);
    this.offQueue.forEach(({ event, callback }) => {
      this.socket?.off(event, callback);
    });

    this.eventQueue = [];
    this.onQueue = [];
    this.offQueue = [];
  }
}

const socketClient = new SocketClient();

export default socketClient;
