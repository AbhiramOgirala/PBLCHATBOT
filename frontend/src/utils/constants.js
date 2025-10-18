export const APP_CONFIG = {
  name: 'PBL Learning Assistant',
  description: 'AI-powered assistant for Project-Based Learning',
  version: '1.0.0'
};

export const CHAT_CONFIG = {
  maxMessageLength: 2000,
  typingDelay: 1000,
  maxHistoryLength: 100
};

export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  ERROR: 'error',
  SYSTEM: 'system'
};

export const STORAGE_KEYS = {
  CHAT_HISTORY: 'pbl_chat_history',
  USER_PREFERENCES: 'pbl_user_prefs'
};