import express from 'express';
import ChatController from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', ChatController.sendMessage);
router.get('/chat/history', ChatController.getChatHistory);

export default router;