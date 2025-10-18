import OpenAIService from '../services/openaiService.js';
import VectorSearchService from '../services/vectorSearchService.js';

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Message is required'
        });
      }

      // Convert conversation history to the format expected by OpenAI
      const messages = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      // Optional: Get context from vector search
      const context = await VectorSearchService.getContextFromQuery(message);

      // Generate AI response
      const aiResponse = await OpenAIService.generateResponse(messages, context);

      res.json({
        response: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  static async getChatHistory(req, res) {
    try {
      // This would typically fetch from your database
      // For now, return empty array
      res.json([]);
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({
        error: 'Failed to fetch chat history'
      });
    }
  }
}

export default ChatController;