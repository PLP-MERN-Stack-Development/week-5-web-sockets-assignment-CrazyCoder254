import React, { forwardRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import moment from 'moment';

const MessageList = forwardRef(({ messages, currentUser, onMessageVisible }, ref) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((message) => (
        <div 
          key={message._id || message.id} 
          className={`mb-4 flex ${message.sender._id === currentUser.id ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
              message.sender._id === currentUser.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border'
            }`}
          >
            {message.sender._id !== currentUser.id && (
              <div className="font-bold text-sm">
                {message.sender.username}
              </div>
            )}
            <div className="mt-1">{message.content}</div>
            <div className={`text-xs mt-1 ${
              message.sender._id === currentUser.id 
                ? 'text-blue-100' 
                : 'text-gray-500'
            }`}>
              {moment(message.createdAt).format('h:mm A')}
              {message.sender._id === currentUser.id && message.status && (
                <span className="ml-2">
                  {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
});

export default MessageList;