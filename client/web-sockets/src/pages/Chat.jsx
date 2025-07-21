import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../hooks/useSocket.jsx';
import Sidebar from '../components/Sidebar.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import UserList from '../components/UserList.jsx';
import RoomList from '../components/RoomList.jsx';
import api from '../services/api.js';

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const {
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
  } = useSocket();
  
  const [activeRoom, setActiveRoom] = useState(roomId || 'global');
  const [activePrivateChat, setActivePrivateChat] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rooms, setRooms] = useState(['global', 'tech', 'gaming']);
  const messagesEndRef = useRef(null);
  
  // Connect to socket on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  // Load room messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.get('/messages', {
          params: { room: activeRoom, limit: 100 }
        });
        // Process messages...
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    
    if (activeRoom && !activePrivateChat) {
      loadMessages();
    }
  }, [activeRoom, activePrivateChat]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle typing events
  useEffect(() => {
    let typingTimer;
    
    if (input) {
      if (!isTyping) {
        setIsTyping(true);
        sendTyping(activeRoom || activePrivateChat?.id, true);
      }
      
      // Reset typing indicator after 3 seconds
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        sendTyping(activeRoom || activePrivateChat?.id, false);
      }, 3000);
    } else if (isTyping) {
      setIsTyping(false);
      sendTyping(activeRoom || activePrivateChat?.id, false);
    }
    
    return () => clearTimeout(typingTimer);
  }, [input, activeRoom, activePrivateChat]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    if (activePrivateChat) {
      sendMessage(input, activePrivateChat.id, null);
    } else {
      sendMessage(input, null, activeRoom);
    }
    
    setInput('');
  };
  
  const handleRoomChange = (room) => {
    setActiveRoom(room);
    setActivePrivateChat(null);
    navigate(`/chat/${room}`);
  };
  
  const handlePrivateChat = (user) => {
    setActivePrivateChat(user);
    setActiveRoom(null);
    navigate('/chat');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomChange={handleRoomChange}
        onLogout={logout}
      />
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h2 className="text-xl font-bold">
            {activePrivateChat 
              ? `Private Chat with ${activePrivateChat.username}` 
              : activeRoom || 'Global Chat'}
          </h2>
          
          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-500">
              {typingUsers.map(u => u.username).join(', ')} is typing...
            </div>
          )}
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <MessageList 
              messages={messages} 
              currentUser={currentUser} 
              ref={messagesEndRef} 
              onMessageVisible={markMessageRead}
            />
            
            <MessageInput 
              value={input}
              onChange={setInput}
              onSend={handleSendMessage}
            />
          </div>
          
          <div className="w-64 border-l bg-white overflow-y-auto">
            <UserList 
              users={onlineUsers} 
              onSelectUser={handlePrivateChat}
              activeUser={activePrivateChat}
            />
            <RoomList 
              rooms={rooms} 
              activeRoom={activeRoom}
              onSelectRoom={handleRoomChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;