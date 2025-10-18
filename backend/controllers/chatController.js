import OpenAIService from '../services/openaiService.js';
import VectorSearchService from '../services/vectorSearchService.js';
import supabase from '../config/supabaseClient.js'; // Add this import

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Message is required'
        });
      }

      console.log('💬 User question:', message);

      // Get relevant context using VECTOR SEARCH
      const context = await VectorSearchService.getRelevantContext(message);
      const hasContext = !!context && context.length > 0;

      console.log('📊 Context stats:', {
        hasContext,
        contextLength: context ? context.length : 0,
        vectorSearch: true
      });

      // Prepare conversation
      const messages = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      messages.push({
        role: 'user',
        content: message
      });

      // Generate AI response with vector-matched context
      console.log('🤖 Generating AI response with vector context...');
      const aiResponse = await OpenAIService.generateResponse(messages, context);

      console.log('✅ AI response generated successfully');

      res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        hasContext: hasContext,
        contextLength: context ? context.length : 0,
        searchMethod: 'vector_similarity'
      });

    } catch (error) {
      console.error('❌ Chat controller error:', error);
      res.status(500).json({
        error: 'Failed to process your message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getChatHistory(req, res) {
    try {
      res.json([]);
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({
        error: 'Failed to fetch chat history'
      });
    }
  }

  // ADD THIS MISSING METHOD
  static async healthCheck(req, res) {
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('document_vectors').select('count').limit(1);
      
      res.json({
        status: 'healthy',
        database: error ? 'disconnected' : 'connected',
        timestamp: new Date().toISOString(),
        service: 'PBL Chatbot API'
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error.message
      });
    }
  }
}

export default ChatController;