import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { initializeGeminiService } from '../services/geminiAI';

interface ApiKeyInputProps {
  onApiKeySet: (hasKey: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initializeGeminiService(apiKey.trim());
      onApiKeySet(true);
      localStorage.setItem('gemini_api_key', apiKey.trim());
    }
  };

  const handleSkip = () => {
    onApiKeySet(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Analysis</h2>
          <p className="text-gray-600">
            Enter your Gemini API key to get intelligent recommendations for your LEO mission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Enable AI Analysis
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Use Mock Data
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <InformationCircleIcon className="h-4 w-4" />
            <span>How to get a Gemini API key?</span>
          </button>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800"
            >
              <h4 className="font-semibold mb-2">Getting your Gemini API Key:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit Google AI Studio (ai.google.dev)</li>
                <li>Sign in with your Google account</li>
                <li>Click "Get API Key" in the top right</li>
                <li>Create a new API key for your project</li>
                <li>Copy and paste it here</li>
              </ol>
              <p className="mt-3 text-xs">
                <strong>Note:</strong> Your API key is stored locally and used only for generating mission analysis reports.
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Without an API key:</p>
              <p>You'll still get a comprehensive analysis using our pre-built intelligence models with realistic recommendations based on your mission parameters.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiKeyInput;