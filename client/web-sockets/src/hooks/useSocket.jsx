import { useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket.js';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Connect to socket
  const connect = useCallback(() => {
    socket.connect();
  }, []);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  // Send a message
  const sendMessage = useCallback((content, receiver = null, room = null) => {
    socket.emit('send_message', { content, receiver, room });
  }, []);

  // Send typing status
  const sendTyping = useCallback((target, isTyping) => {
    socket.emit('typing', { target, isTyping });
  }, []);

  // Mark message as read
  const markMessageRead = useCallback((messageId) => {
    socket.emit('mark_read', messageId);
  }, []);

  // Socket event listeners
  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    const onReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
      
      // Play notification sound for new messages
      if (message.sender !== socket.userId) {
        new Audio('/notification.mp3').play().catch(e => console.log('Audio play failed:', e));
        
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${message.sender.username}`, {
            body: message.content.length > 50 
              ? `${message.content.substring(0, 50)}...` 
              : message.content
          });
        }
      }
    };
    
    const onUserOnline = (userId) => {
      setOnlineUsers(prev => {
        // Add or update user
        const exists = prev.some(u => u.id === userId);
        return exists ? prev : [...prev, { id: userId, online: true }];
      });
    };
    
    const onUserOffline = (userId) => {
      setOnlineUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, online: false } : u
      ));
    };
    
    const onUserTyping = ({ userId, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return [...prev.filter(u => u.id !== userId), { id: userId, isTyping: true }];
        } else {
          return prev.filter(u => u.id !== userId);
        }
      });
    };
    
    const onNotification = (notification) => {
      setNotifications(prev => [...prev, notification]);
    };
    
    const onMessageStatus = ({ messageId, status }) => {
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, status } : msg)
      );
    };
    
    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('user_online', onUserOnline);
    socket.on('user_offline', onUserOffline);
    socket.on('user_typing', onUserTyping);
    socket.on('notification', onNotification);
    socket.on('message_status', onMessageStatus);
    
    // Request notification permission
    if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Clean up
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('user_online', onUserOnline);
      socket.off('user_offline', onUserOffline);
      socket.off('user_typing', onUserTyping);
      socket.off('notification', onNotification);
      socket.off('message_status', onMessageStatus);
    };
  }, []);

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    notifications,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    markMessageRead
  };
};