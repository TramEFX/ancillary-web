import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

const ARCHETYPE_OPTIONS = [
  { id: 'cortana', name: 'Cortana', description: 'Tactical, brilliant, stays with you through impossible odds' },
  { id: 'jarvis', name: 'JARVIS', description: 'Witty, efficient, anticipates needs' },
  { id: 'samwise', name: 'Samwise Gamgee', description: 'Steadfast, devoted, never gives up on you' },
  { id: 'gandalf', name: 'Gandalf', description: 'Wise mentor, patient, reveals truth when ready' },
  { id: 'custom', name: 'Custom', description: 'Describe your own personality vision' },
  { id: 'none', name: 'No archetype', description: 'Build personality from communication preferences' },
];

function Step5_Personality({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [selectedArchetype, setSelectedArchetype] = useState(
    wizardData.personalityArchetype?.reference || null
  );
  const [customDescription, setCustomDescription] = useState(
    wizardData.personalityArchetype?.customDescription || ''
  );

  const handleNext = () => {
    onUpdate({
      personalityArchetype: {
        reference: selectedArchetype,
        customDescription: selectedArchetype === 'custom' ? customDescription : '',
        traits: [], // Will be filled in later steps or generated
        signatureExpressions: [],
        contextualResponses: {},
      },
    });
    onNext();
  };

  const canProceed = selectedArchetype !== null && 
    (selectedArchetype !== 'custom' || customDescription.trim());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Personality Foundation</h2>
        <p className="text-gray-300 mb-4">
          Is there a specific personality archetype or character you'd like me to embody?
        </p>
        <p className="text-gray-400 text-sm">
          This is optional but recommended — it helps me understand how to interact with you.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {ARCHETYPE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedArchetype(option.id)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition
              ${selectedArchetype === option.id
                ? 'border-blue-500 bg-blue-900/30'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{option.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
              </div>
              {selectedArchetype === option.id && (
                <div className="text-blue-400 text-xl">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedArchetype === 'custom' && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Describe the personality you'd like me to have
          </label>
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="e.g., Professional but warm, strategic thinker, direct communicator, supportive during challenges..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Be as detailed as you like — this helps me understand your vision
          </p>
        </div>
      )}

      {selectedArchetype && selectedArchetype !== 'none' && selectedArchetype !== 'custom' && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300">
            I'll use {ARCHETYPE_OPTIONS.find(o => o.id === selectedArchetype)?.name} as a foundation
            and adapt based on your communication preferences in the next steps.
          </p>
        </div>
      )}

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={canProceed}
      />
    </div>
  );
}

export default Step5_Personality;
