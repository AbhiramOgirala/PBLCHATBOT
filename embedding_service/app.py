from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)

# Load the same model you used for your documents
model = SentenceTransformer("all-MiniLM-L6-v2")

@app.route('/embed', methods=['POST'])
def generate_embedding():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Generate embedding - 384 dimensions
        embedding = model.encode([text])[0]
        
        # Convert to list for JSON
        embedding_list = embedding.tolist()
        
        return jsonify({
            'embedding': embedding_list,
            'dimensions': len(embedding_list),
            'model': 'all-MiniLM-L6-v2'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model': 'all-MiniLM-L6-v2'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)