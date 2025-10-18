import React from 'react';
import Chat from './components/Chat.jsx';
import { APP_CONFIG } from './utils/constants.js';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {APP_CONFIG.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {APP_CONFIG.description} - Get personalized guidance, feedback, and resources 
            for your project-based learning journey.
          </p>
        </header>

        {/* Main Chat Component */}
        <div className="animate-slide-up">
          <Chat />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Powered by AI • Built for learning • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;