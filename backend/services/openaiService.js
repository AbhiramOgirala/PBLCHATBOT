import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  static async generateResponse(messages, context = '') {
    try {
      const systemMessage = {
        role: 'system',
        content: this.createVectorAwarePrompt(context)
      };

      const conversation = [systemMessage, ...messages];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversation,
        max_tokens: 800,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate response from AI service');
    }
  }

  static createVectorAwarePrompt(context) {
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