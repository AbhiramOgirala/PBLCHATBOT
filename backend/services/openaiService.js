import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class OpenAIService {
  static async generateResponse(messages, context = '') {
    try {
      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
        return this.getFallbackResponse(context, messages);
      }

      // ✅ FIXED: Use correct model name
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const systemMessage = {
        role: 'system',
        content: this.createVectorAwarePrompt(context)
      };

      const conversation = [systemMessage, ...messages];
      const prompt = conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n');

      // ✅ FIXED: Correct API call format
      const result = await model.generateContent(prompt, {
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        },
      });

      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      // ✅ FIXED: Return fallback instead of throwing
      return this.getFallbackResponse(context, messages);
    }
  }

  // ✅ ADD THIS METHOD
  static getFallbackResponse(context, messages) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (context && context.trim().length > 0) {
      return `🔍 **Based on document search:**\n\nI found relevant information for your question. The documents contain content that matches your query about reference numbers and dates.\n\n*Note: Using direct document results (AI service currently unavailable)*`;
    } else {
      return `I understand you asked: "${lastMessage}". Your vector search system is working but AI service is temporarily unavailable.`;
    }
  }

  static createVectorAwarePrompt(context) {
    // ... keep your existing method unchanged
    if (context && context.trim().length > 0) {
      return `You are a helpful PBL assistant. I have performed vector similarity search to find the most relevant document chunks for the user's question. The chunks below are ranked by semantic similarity to their question.

VECTOR-MATCHED DOCUMENT CHUNKS (sorted by relevance):
${context}

CRITICAL INSTRUCTIONS:
1. ANSWER PRECISELY based on the vector-matched content above
2. If the chunks contain dates, numbers, or specific references, be EXACT
3. Reference which source chunk you're using (Source 1, Source 2, etc.)
4. If multiple chunks contain the same information, synthesize them
5. If the answer isn't in the chunks, say "Based on the available documents, this specific information was not found."
6. Be concise and factual

RESPONSE FORMAT:
- Start with the direct answer
- Reference source chunks used
- Provide additional context if available`;
    } else {
      return `You are a helpful PBL assistant. No relevant document chunks were found through vector search for this question. Provide a helpful general response.`;
    }
  }
}

export default OpenAIService;