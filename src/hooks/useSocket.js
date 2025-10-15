import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (addNotification) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('✅ AdminDashboard connected to server');
      addNotification('Connected to real-time updates', 'success');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ AdminDashboard disconnected from server');
      addNotification('Disconnected from real-time updates', 'warning');
    });

    socketRef.current.on('connect_error', (error) => {
      console.log('❌ Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [addNotification]);

  return {
    socket: socketRef.current
  };
};