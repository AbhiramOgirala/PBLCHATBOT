import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="chat-bubble-ai">
        <div className="typing-indicator">
          <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
          <span className="text-gray-500 text-sm ml-2">Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;