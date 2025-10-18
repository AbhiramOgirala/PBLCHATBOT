import React from 'react';
import { Bot, Users } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants.js';

const ChatHeader = ({ messageCount = 0, onClear }) => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{APP_CONFIG.name}</h1>
            <p className="text-primary-100 text-sm flex items-center space-x-1">
              <Users size={14} />
              <span>{APP_CONFIG.description}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-primary-100 bg-white/10 px-3 py-1 rounded-full">
            {messageCount} messages
          </div>
          
          {messageCount > 0 && (
            <button
              onClick={onClear}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;