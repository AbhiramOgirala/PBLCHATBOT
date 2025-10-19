import supabase from '../config/supabaseClient.js';

class VectorSearchService {
  static async getRelevantContext(userQuestion, matchThreshold = 0.1, matchCount = 10) {
    try {
      console.log('🔍 PURE VECTOR SEARCH - Vectorizing user question:', userQuestion.substring(0, 100));
      
      // Step 1: Generate embedding for user question
      const questionEmbedding = await this.generateEmbedding(userQuestion);
      
      if (!questionEmbedding) {
        console.log('❌ Vectorization failed - NO FALLBACK TO TEXT SEARCH');
        return ''; // Return empty instead of falling back to text search
      }

      console.log('✅ Question vectorized, performing PURE vector similarity search...');
      
      // Step 2: Perform PURE vector similarity search in Supabase
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: questionEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      if (error) {
        console.error('❌ Vector search error:', error);
        return ''; // No fallback to text search
      }

      console.log(`✅ PURE VECTOR SEARCH found ${data?.length || 0} relevant chunks`);

      if (!data || data.length === 0) {
        console.log('⚠️ No vector results found - USING NO CONTEXT');
        return ''; // No fallback to text search
      }

      // Step 3: Format the top chunks with similarity scores
      const context = this.formatContextWithScores(data);

      console.log(`📚 PURE VECTOR SEARCH returning ${data.length} vector-matched chunks`);
      return context;

    } catch (error) {
      console.error('❌ Error in PURE vector search:', error);
      return ''; // No fallback to text search
    }
  }

  static async generateEmbedding(text) {
    try {
      console.log('🔄 Calling Python embedding service for REAL vectorization...');
      
      const response = await fetch('http://localhost:8000/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
      });
      
      if (!response.ok) {
        throw new Error(`Embedding service HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.embedding) {
        throw new Error('No embedding returned from service');
      }
      
      console.log(`✅ REAL VECTOR generated: ${data.embedding.length} dimensions`);
      return data.embedding;
      
    } catch (error) {
      console.error('❌ Vectorization service failed - NO FALLBACK:', error.message);
      return null;
    }
  }

  static formatContextWithScores(chunks) {
    return chunks
      .map((chunk, index) => 
        `[VECTOR MATCH ${index + 1}: ${chunk.file_name} - Page ${chunk.page_num} - Similarity: ${(chunk.similarity * 100).toFixed(1)}%]\n${chunk.chunk_text}`
      )
      .join('\n\n');
  }

  // REMOVED ALL TEXT SEARCH METHODS - NO FALLBACKS!
}

export default VectorSearchService;