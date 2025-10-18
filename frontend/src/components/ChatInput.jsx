import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const toggleRecording = () => {
    // Placeholder for voice recording functionality
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Error message placeholder */}
        <div className="h-5">
          {/* Error messages can be displayed here */}
        </div>
        
        <div className="flex space-x-3 items-end">
          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="input-field min-h-[44px] max-h-[120px] py-3 pr-12"
              disabled={disabled || isLoading}
              rows={1}
            />
            
            {/* Character count */}
            {message.length > 0 && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                {message.length}/1000
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            {/* Voice recording button - placeholder */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || isLoading}
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                isRecording 
                  ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        {/* Helper text */}
        <div className="text-xs text-gray-500 text-center">
          Ask questions about your project, get feedback, or seek guidance
        </div>
      </form>
    </div>
  );
};

export default ChatInput;