// Socket.IO Provider for real-time watchlist updates
// Install: npm install socket.io-client
// Uncomment the code below after installing socket.io-client

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
// import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || BASE_URL
).replace(/\/+$/, '');

interface SocketContextValue {
  // socket: Socket | null;
  connected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  // socket: null,
  connected: false,
  error: null,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log('ℹ️ No auth token, skipping Socket.IO connection');
      return;
    }

    console.log('🔌 Connecting to Socket.IO...');

    // UNCOMMENT AFTER INSTALLING socket.io-client:
    /*
    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected');
      setConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket.IO connection error:', err.message);
      setError(err.message);
      setConnected(false);
    });

    // Listen for watchlist updates
    newSocket.on('watchlist:updated', (data) => {
      console.log('🔔 Watchlist updated:', data);
      // Trigger a custom event that components can listen to
      window.dispatchEvent(new CustomEvent('watchlist:updated', { detail: data }));
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting Socket.IO...');
      newSocket.close();
    };
    */

    // Temporary placeholder until socket.io-client is installed
    console.log('ℹ️ Socket.IO client not installed yet');
    console.log('ℹ️ Run: npm install socket.io-client');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ connected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
