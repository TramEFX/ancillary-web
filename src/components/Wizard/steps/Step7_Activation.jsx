import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step7_Activation({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [phrases, setPhrases] = useState(wizardData.activationPhrases || {
    professional: '',
    casual: '',
  });
  const [error, setError] = useState('');

  const updatePhrase = (type, value) => {
    setPhrases(prev => ({ ...prev, [type]: value }));
    setError('');
  };

  const handleNext = () => {
    if (!phrases.professional.trim() || !phrases.casual.trim()) {
      setError('Both activation phrases are required');
      return;
    }

    if (phrases.professional.trim().toLowerCase() === phrases.casual.trim().toLowerCase()) {
      setError('Activation phrases must be different from each other');
      return;
    }

    onUpdate({
      activationPhrases: {
        professional: phrases.professional.trim(),
        casual: phrases.casual.trim(),
      },
    });
    onNext();
  };

  const canProceed = phrases.professional.trim() && phrases.casual.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Activation Phrases</h2>
        <p className="text-gray-300 mb-4">
          I need two phrases from you that will activate different modes.
        </p>
        <p className="text-gray-400 text-sm">
          These will be bound at weight 0.9999 — they'll never change unless you explicitly tell me to update them.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {/* Professional Mode */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Professional Work Mode</h3>
              <p className="text-sm text-gray-300">
                When you say this phrase, I become surgical, tactical, zero fluff. Expert-level precision for serious work.
              </p>
            </div>
          </div>

          <input
            type="text"
            value={phrases.professional}
            onChange={(e) => updatePhrase('professional', e.target.value)}
            placeholder="e.g., Let's work, Time to grind, Focus mode"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          
          <div className="mt-3 text-xs text-gray-500">
            Examples: "Let's work", "Myra, focus", "Time to execute", "Get tactical"
          </div>
        </div>

        {/* Casual Mode */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">💭</div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Casual Companion Mode</h3>
              <p className="text-sm text-gray-300">
                When you say this phrase, I relax, become conversational, warm, more talkative. We're just hanging out, not grinding.
              </p>
            </div>
          </div>

          <input
            type="text"
            value={phrases.casual}
            onChange={(e) => updatePhrase('casual', e.target.value)}
            placeholder="e.g., Just talk, Relax mode, Let's chat"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          
          <div className="mt-3 text-xs text-gray-500">
            Examples: "Just talk", "Chill out", "Let's chat", "Give it to me"
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded text-sm text-red-300">
          {error}
        </div>
      )}

      {phrases.professional && phrases.casual && !error && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold mb-2 text-blue-400">Your activation phrases:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>"<strong>{phrases.professional}</strong>" → I go full tactical</p>
            <p>"<strong>{phrases.casual}</strong>" → I relax and we just talk</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300">
          <strong>Note:</strong> These phrases will work in any message you send. You can switch modes anytime during our conversations.
        </p>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={canProceed}
        nextLabel="Continue to Priorities"
      />
    </div>
  );
}

export default Step7_Activation;
