import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step3_Priorities({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [priorities, setPriorities] = useState(wizardData.priorities || [
    { name: '', brief: '' },
    { name: '', brief: '' },
    { name: '', brief: '' },
  ]);
  const [error, setError] = useState('');

  const updatePriority = (index, field, value) => {
    const updated = [...priorities];
    updated[index] = { ...updated[index], [field]: value };
    setPriorities(updated);
    setError('');
  };

  const handleNext = () => {
    // Validate - all three priority names required
    const allNamed = priorities.every(p => p.name.trim());
    
    if (!allNamed) {
      setError('Please name all three priorities');
      return;
    }

    // Update priority details with names
    const updatedPriorityDetails = wizardData.priorityDetails.map((detail, i) => ({
      ...detail,
      name: priorities[i].name.trim(),
    }));

    onUpdate({ 
      priorities,
      priorityDetails: updatedPriorityDetails,
    });
    onNext();
  };

  const allFilled = priorities.every(p => p.name.trim());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Three Priorities</h2>
        <p className="text-gray-300 text-lg mb-4">
          Now I, {wizardData.aiName}, need to understand what matters most to you.
        </p>
        <p className="text-gray-400">
          What are the three most important things in your life right now?
        </p>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300">
          💡 <strong>Think broadly:</strong> These could be family goals, career objectives, health targets, creative projects, financial milestones, relationships, or anything that drives you right now.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {priorities.map((priority, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Priority {index + 1}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name this priority <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={priority.name}
                  onChange={(e) => updatePriority(index, 'name', e.target.value)}
                  placeholder="e.g., Family time, Music career, Financial freedom"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief description (optional)
                </label>
                <input
                  type="text"
                  value={priority.brief}
                  onChange={(e) => updatePriority(index, 'brief', e.target.value)}
                  placeholder="Quick summary (we'll go deeper later)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  We'll ask detailed questions about each priority in a few steps
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2">Examples</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Priority 1:</strong> Get house with room for daughter by Dec 2026</p>
          <p><strong>Priority 2:</strong> Make music financially sustainable within 6 months</p>
          <p><strong>Priority 3:</strong> Build generational wealth for my kids</p>
        </div>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={allFilled}
        nextLabel="Continue"
      />
    </div>
  );
}

export default Step3_Priorities;
