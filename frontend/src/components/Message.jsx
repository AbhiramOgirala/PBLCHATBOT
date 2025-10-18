import React from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers.js';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;
  
  const getBubbleClass = () => {
    if (isError) return 'chat-bubble-error';
    return isUser ? 'chat-bubble-user' : 'chat-bubble-ai';
  };
  
  const getIcon = () => {
    if (isError) return <AlertCircle size={16} className="flex-shrink-0" />;
    return isUser ? <User size={16} className="flex-shrink-0" /> : <Bot size={16} className="flex-shrink-0" />;
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-full`}>
        {/* Avatar */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          isError ? 'bg-red-100 text-red-600' : 
          isUser ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {getIcon()}
        </div>
        
        {/* Message Bubble */}
        <div className={`${getBubbleClass()} ${isUser ? 'ml-12' : 'mr-12'}`}>
          <div className="flex flex-col">
            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
            <div className={`text-xs mt-2 opacity-70 ${isError ? 'text-red-600' : ''}`}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;