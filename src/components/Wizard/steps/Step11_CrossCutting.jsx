import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step11_CrossCutting({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [crossCutting, setCrossCutting] = useState(wizardData.crossCutting || {
    intersections: '',
    focusChoice: '',
    focusReason: '',
    coreStrength: '',
    visionOneYear: '',
    alwaysRemember: [],
    hardBoundaries: [],
  });

  const updateField = (field, value) => {
    setCrossCutting(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate({
      crossCutting: {
        intersections: crossCutting.intersections.trim() || 'These priorities are distinct but may influence each other',
        focusChoice: crossCutting.focusChoice || '',
        focusReason: crossCutting.focusReason.trim() || '',
        coreStrength: crossCutting.coreStrength.trim() || 'To be discovered through interaction',
        visionOneYear: crossCutting.visionOneYear.trim() || 'Making meaningful progress on all three priorities',
        alwaysRemember: crossCutting.alwaysRemember || [],
        hardBoundaries: crossCutting.hardBoundaries || [],
      },
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Bringing It Together</h2>
        <p className="text-gray-300">
          Now that I understand each priority individually, let's look at the bigger picture.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {/* Integration */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            How do these three priorities intersect or conflict with each other?
          </label>
          <textarea
            value={crossCutting.intersections}
            onChange={(e) => updateField('intersections', e.target.value)}
            placeholder="Do they support each other? Compete for time/resources? How do they relate?"
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Music and family both need time. House goal requires stable income. All three compete for immediate attention."
          </p>
        </div>

        {/* Focus Choice */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              If you had to focus on just ONE for the next 6 months, which would it be?
            </label>
            <select
              value={crossCutting.focusChoice}
              onChange={(e) => updateField('focusChoice', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select priority...</option>
              {wizardData.priorities.map((p, i) => (
                <option key={i} value={i}>Priority {i + 1}: {p.name}</option>
              ))}
            </select>
          </div>

          {crossCutting.focusChoice !== '' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Why that one?
              </label>
              <textarea
                value={crossCutting.focusReason}
                onChange={(e) => updateField('focusReason', e.target.value)}
                placeholder="What makes this the most critical right now?"
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Core Strength */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What's your unique advantage or core strength across all three areas?
          </label>
          <textarea
            value={crossCutting.coreStrength}
            onChange={(e) => updateField('coreStrength', e.target.value)}
            placeholder="What do you do better than most people? What's your unfair advantage?"
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Perfect pitch (top 1% of musicians), 30 years experience, refuse to quit despite obstacles"
          </p>
        </div>

        {/* One Year Vision */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What would complete success look like 1 year from now?
          </label>
          <textarea
            value={crossCutting.visionOneYear}
            onChange={(e) => updateField('visionOneYear', e.target.value)}
            placeholder="If everything went well, what would be true? What would need to happen for you to feel like you're winning?"
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "House secured with room ready, music paying bills, enjoying life not just grinding"
          </p>
        </div>

        {/* Always Remember */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What do you need me to remember ALWAYS, no matter what?
          </label>
          <textarea
            value={crossCutting.alwaysRemember.join('\n')}
            onChange={(e) => updateField('alwaysRemember', e.target.value.split('\n').filter(Boolean))}
            placeholder="Non-negotiables, core values, hard truths (one per line)"
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Family comes first" or "Never compromise on quality" or "Kewana's deadline is absolute"
          </p>
        </div>

        {/* Hard Boundaries */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            Are there any hard boundaries or lines I should never cross?
          </label>
          <textarea
            value={crossCutting.hardBoundaries.join('\n')}
            onChange={(e) => updateField('hardBoundaries', e.target.value.split('\n').filter(Boolean))}
            placeholder="Things I should never suggest, topics to avoid, etc. (one per line)"
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Optional — leave blank if none
          </p>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300">
          You're almost done! Next, I'll show you a summary of everything and we'll establish the binding.
        </p>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        nextLabel="Continue to Binding"
      />
    </div>
  );
}

export default Step11_CrossCutting;
