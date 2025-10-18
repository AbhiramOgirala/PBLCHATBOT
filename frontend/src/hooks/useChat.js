import { useState, useCallback } from 'react';
import { chatAPI } from '../services/api.js';
import { useChatHistory } from './useLocalStorage.js';
import { validateMessage } from '../utils/helpers.js';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { chatHistory, addMessage, clearHistory } = useChatHistory();

  const sendMessage = useCallback(async (message) => {
    const validation = validateMessage(message);
    if (!validation.isValid) {
      setError(validation.error);
      return null;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      addMessage(userMessage);

      // Send to API
      const response = await chatAPI.sendMessage(message, chatHistory);
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: response.response,
        timestamp: response.timestamp,
        hasContext: response.hasContext
      };
      
      addMessage(aiMessage);
      return aiMessage;

    } catch (err) {
      console.error('Chat error:', err);
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: `I apologize, but I encountered an error: ${err.message}. Please try again in a moment.`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      addMessage(errorMessage);
      setError(err.message);
      return errorMessage;

    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, addMessage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages: chatHistory,
    sendMessage,
    clearHistory,
    isLoading,
    error,
    clearError
  };
};