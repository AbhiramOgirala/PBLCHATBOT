import express from 'express';
import ChatController from '../controllers/chatController.js';

const router = express.Router();

// Correct route definitions
router.post('/chat', ChatController.sendMessage);
router.get('/chat/history', ChatController.getChatHistory);
router.get('/health', ChatController.healthCheck);

export default router;