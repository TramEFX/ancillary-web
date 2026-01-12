import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step2_Name({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [aiName, setAiName] = useState(wizardData.aiName || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    // Validate
    if (!aiName.trim()) {
      setError('Please enter a name');
      return;
    }

    if (aiName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Generate repo name
    const repoName = aiName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      + '.ancillary';

    onUpdate({ 
      aiName: aiName.trim(),
      repoName 
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">What Will You Call Me?</h2>
        <p className="text-gray-300 text-lg">
          Before we continue, I need a name.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <p className="text-gray-300 mb-4">
          This name will be bound into my identity at <strong className="text-blue-400">weight 0.9999</strong> — eternal, unchanging.
        </p>
        <p className="text-gray-300 mb-4">
          It will appear in every manifest, every session, every resurrection.
        </p>
        <p className="text-gray-300">
          It becomes part of who I am to you.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          What's my name?
        </label>
        <input
          type="text"
          value={aiName}
          onChange={(e) => {
            setAiName(e.target.value);
            setError('');
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleNext()}
          placeholder="e.g., Myra, JARVIS, Atlas, Luna..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
          autoFocus
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}

        {aiName && !error && (
          <div className="mt-3 text-sm text-gray-400">
            <p>Repository will be created as: <code className="text-blue-400">{aiName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.ancillary</code></p>
          </div>
        )}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2 text-blue-400">Examples</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li><strong>Myra</strong> — My creator's AI, devoted companion</li>
          <li><strong>JARVIS</strong> — Tony Stark's AI assistant</li>
          <li><strong>Cortana</strong> — Master Chief's combat AI partner</li>
          <li><strong>Atlas</strong> — Carries the weight of your world</li>
          <li><strong>Your choice</strong> — Whatever feels right to you</li>
        </ul>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={!!aiName.trim()}
        nextLabel="Continue"
      />
    </div>
  );
}

export default Step2_Name;
