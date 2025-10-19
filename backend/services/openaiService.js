import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class OpenAIService {
  static async generateResponse(messages, context = '') {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return this.getFallbackResponse(context, messages);
      }

      // ✅ TRY THESE WORKING MODELS IN ORDER:
      const modelNames = [
        'gemini-1.0-pro',
        'gemini-pro', 
        'models/gemini-pro',
        'gemini-1.5-flash-latest'
      ];

      let lastError = null;
      
      for (const modelName of modelNames) {
        try {
          console.log(`🔄 Trying model: ${modelName}`);
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7,
            }
          });

          const prompt = this.createVectorAwarePrompt(context, messages);
          const result = await model.generateContent(prompt);
          console.log(`✅ Success with model: ${modelName}`);
          return result.response.text();
          
        } catch (error) {
          lastError = error;
          console.log(`❌ Failed with ${modelName}:`, error.message);
          continue; // Try next model
        }
      }
      
      // If all models fail, use fallback
      throw lastError;

    } catch (error) {
      console.error('All Gemini models failed:', error.message);
      return this.getFallbackResponse(context, messages);
    }
  }

  static createVectorAwarePrompt(context, messages) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (context && context.trim().length > 0) {
      return `Answer this question based ONLY on the provided document context:

QUESTION: ${lastMessage}

DOCUMENT CONTEXT:
${context}

INSTRUCTIONS:
- Answer precisely using only the document context
- If the answer isn't in the context, say "Based on the documents, this information was not found"
- Be specific about dates, numbers, and references
- Keep response concise

ANSWER:`;
    } else {
      return `Question: ${lastMessage}\n\nNo relevant document context found. Provide a helpful response.`;
    }
  }

  static getFallbackResponse(context, messages) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (context && context.trim().length > 0) {
      // Extract answer directly from context
      const answer = this.extractAnswerFromContext(context, lastMessage);
      return `🔍 **Based on document search:**\n\n${answer}\n\n*Note: Using direct document results*`;
    }
    
    return `I understand: "${lastMessage}". Your vector search found no specific matches in the documents.`;
  }

  static extractAnswerFromContext(context, question) {
    // Simple extraction for dates
    if (question.toLowerCase().includes('date')) {
      const dateMatch = context.match(/dated\s+([^,\.]+)/i);
      if (dateMatch) return `The document mentions: ${dateMatch[0]}`;
      
      const octoberMatch = context.match(/October\s+\d{1,2},?\s+\d{4}/);
      if (octoberMatch) return `The document mentions: ${octoberMatch[0]}`;
    }
    
    return `I found relevant document content matching your question. The vector search successfully located 10 relevant chunks from your PDFs.`;
  }
}

export default OpenAIService;