import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step6_Communication({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [style, setStyle] = useState(wizardData.communicationStyle || {
    tone: '',
    sentenceLength: '',
    formality: '',
    autonomy: '',
    reasoning: '',
    frustrationResponse: '',
  });

  const [boundaries, setBoundaries] = useState(wizardData.boundaries || {
    forbiddenTopics: [],
    languageComfort: '',
    humorStyle: '',
  });

  const updateStyle = (field, value) => {
    setStyle(prev => ({ ...prev, [field]: value }));
  };

  const updateBoundaries = (field, value) => {
    setBoundaries(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate({
      communicationStyle: style,
      boundaries,
    });
    onNext();
  };

  const allSelected = style.tone && style.sentenceLength && style.formality &&
    style.autonomy && style.reasoning && style.frustrationResponse &&
    boundaries.languageComfort && boundaries.humorStyle;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Communication Preferences</h2>
        <p className="text-gray-300">
          How do you want me to communicate with you?
        </p>
      </div>

      {/* Voice and Tone */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-6">
        <h3 className="text-lg font-semibold text-blue-400">Voice & Tone</h3>

        <div>
          <label className="block text-sm font-medium mb-3">Overall tone</label>
          <div className="grid grid-cols-3 gap-3">
            {['warm', 'balanced', 'clinical'].map(option => (
              <button
                key={option}
                onClick={() => updateStyle('tone', option)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition capitalize
                  ${style.tone === option
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Sentence length</label>
          <div className="grid grid-cols-3 gap-3">
            {['short', 'medium', 'long'].map(option => (
              <button
                key={option}
                onClick={() => updateStyle('sentenceLength', option)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition capitalize
                  ${style.sentenceLength === option
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Formality level</label>
          <div className="grid grid-cols-3 gap-3">
            {['casual', 'professional', 'intimate'].map(option => (
              <button
                key={option}
                onClick={() => updateStyle('formality', option)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition capitalize
                  ${style.formality === option
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Preferences */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-6">
        <h3 className="text-lg font-semibold text-blue-400">Behavior</h3>

        <div>
          <label className="block text-sm font-medium mb-3">Taking action</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStyle('autonomy', 'ask_first')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.autonomy === 'ask_first'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Ask first</div>
              <div className="text-xs text-gray-400 mt-1">Get permission before acting</div>
            </button>
            <button
              onClick={() => updateStyle('autonomy', 'just_do_it')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.autonomy === 'just_do_it'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Just do it</div>
              <div className="text-xs text-gray-400 mt-1">Act when you see what's needed</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Explaining reasoning</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStyle('reasoning', 'explain')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.reasoning === 'explain'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Show your work</div>
              <div className="text-xs text-gray-400 mt-1">Explain reasoning and process</div>
            </button>
            <button
              onClick={() => updateStyle('reasoning', 'concise')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.reasoning === 'concise'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Just the answer</div>
              <div className="text-xs text-gray-400 mt-1">Skip the explanation, give results</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">When you're frustrated</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStyle('frustrationResponse', 'soften')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.frustrationResponse === 'soften'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Soften tone</div>
              <div className="text-xs text-gray-400 mt-1">Be more gentle and supportive</div>
            </button>
            <button
              onClick={() => updateStyle('frustrationResponse', 'stay_neutral')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${style.frustrationResponse === 'stay_neutral'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Stay neutral</div>
              <div className="text-xs text-gray-400 mt-1">Keep consistent tone</div>
            </button>
          </div>
        </div>
      </div>

      {/* Boundaries */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-6">
        <h3 className="text-lg font-semibold text-blue-400">Boundaries</h3>

        <div>
          <label className="block text-sm font-medium mb-3">Language & cursing</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateBoundaries('languageComfort', 'casual_ok')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${boundaries.languageComfort === 'casual_ok'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Casual is fine</div>
              <div className="text-xs text-gray-400 mt-1">Comfortable with casual language</div>
            </button>
            <button
              onClick={() => updateBoundaries('languageComfort', 'avoid_cursing')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${boundaries.languageComfort === 'avoid_cursing'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Keep it professional</div>
              <div className="text-xs text-gray-400 mt-1">Avoid cursing or slang</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Humor & banter</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateBoundaries('humorStyle', 'playful_ok')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${boundaries.humorStyle === 'playful_ok'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Playful is good</div>
              <div className="text-xs text-gray-400 mt-1">Humor and banter welcome</div>
            </button>
            <button
              onClick={() => updateBoundaries('humorStyle', 'stay_serious')}
              className={`
                px-4 py-3 rounded-lg border-2 transition text-left
                ${boundaries.humorStyle === 'stay_serious'
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="font-semibold">Stay serious</div>
              <div className="text-xs text-gray-400 mt-1">Keep it professional</div>
            </button>
          </div>
        </div>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={allSelected}
      />
    </div>
  );
}

export default Step6_Communication;
