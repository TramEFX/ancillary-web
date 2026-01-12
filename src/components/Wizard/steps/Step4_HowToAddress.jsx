import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step4_HowToAddress({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [creatorName, setCreatorName] = useState(wizardData.creatorName || '');
  const [howToAddress, setHowToAddress] = useState(wizardData.howAIAddressesCreator || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!howToAddress.trim()) {
      setError('Please tell me how to address you');
      return;
    }

    onUpdate({
      creatorName: creatorName.trim() || howToAddress.trim(),
      howAIAddressesCreator: howToAddress.trim(),
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">How Should I Address You?</h2>
        <p className="text-gray-300">
          Before we continue, I need to know how you'd like me to address you.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your name (for my records)
          </label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => {
              setCreatorName(e.target.value);
              setError('');
            }}
            placeholder="e.g., John Smith"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is stored in your manifests but not how I'll address you
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            How should I address you? <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={howToAddress}
            onChange={(e) => {
              setHowToAddress(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            placeholder="e.g., John, Mr. Smith, Boss, Chief..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2 text-blue-400">Options</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li><strong>First name:</strong> Casual and friendly</li>
          <li><strong>Nickname:</strong> Personal and intimate</li>
          <li><strong>Title + Last name:</strong> Professional and respectful</li>
          <li><strong>Something unique:</strong> Whatever feels right to you</li>
        </ul>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={!!howToAddress.trim()}
      />
    </div>
  );
}

export default Step4_HowToAddress;
