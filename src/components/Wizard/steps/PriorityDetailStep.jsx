import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function PriorityDetailStep({ 
  priorityIndex,
  wizardData, 
  onUpdate, 
  onNext, 
  onBack, 
  onCancel 
}) {
  const priority = wizardData.priorities[priorityIndex];
  const details = wizardData.priorityDetails[priorityIndex];
  
  const [formData, setFormData] = useState({
    context: details.context || '',
    successCriteria: details.successCriteria || '',
    peopleInvolved: details.peopleInvolved?.join(', ') || '',
    deadline: details.deadline || '',
    urgency: details.urgency || '',
    blockers: details.blockers?.join(', ') || '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Update priority details
    const updatedPriorityDetails = [...wizardData.priorityDetails];
    updatedPriorityDetails[priorityIndex] = {
      ...details,
      name: priority.name,
      context: formData.context.trim() || 'To be defined through ongoing interaction',
      successCriteria: formData.successCriteria.trim() || 'To be defined',
      peopleInvolved: formData.peopleInvolved
        ? formData.peopleInvolved.split(',').map(p => p.trim()).filter(Boolean)
        : [],
      deadline: formData.deadline.trim() || 'No specific deadline',
      urgency: formData.urgency || 'growth',
      blockers: formData.blockers
        ? formData.blockers.split(',').map(b => b.trim()).filter(Boolean)
        : [],
    };

    onUpdate({ priorityDetails: updatedPriorityDetails });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-sm text-blue-400 mb-2">Priority {priorityIndex + 1} of 3</div>
        <h2 className="text-3xl font-bold mb-4">{priority.name}</h2>
        {priority.brief && (
          <p className="text-gray-400">{priority.brief}</p>
        )}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300">
          💡 <strong>Be as detailed as you can.</strong> The more context you provide, the better I can help you achieve this priority. If you're not sure about something, that's okay — just share what you know.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {/* Context */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What's your current situation with this priority?
          </label>
          <textarea
            value={formData.context}
            onChange={(e) => updateField('context', e.target.value)}
            placeholder="Where are you now? What's the current state? What led you here?"
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Working 60 hours/week, need to reduce to 40. Manager is supportive but deadlines are tight."
          </p>
        </div>

        {/* Success Criteria */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What does success look like specifically?
          </label>
          <textarea
            value={formData.successCriteria}
            onChange={(e) => updateField('successCriteria', e.target.value)}
            placeholder="How will you know you've achieved this? What's the target state?"
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "House with 3+ bedrooms in budget, room ready for daughter by Dec 2026"
          </p>
        </div>

        {/* People Involved */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            Who's involved or affected by this?
          </label>
          <input
            type="text"
            value={formData.peopleInvolved}
            onChange={(e) => updateField('peopleInvolved', e.target.value)}
            placeholder="Names or roles, separated by commas"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Kewana (daughter), Cadence, band members, manager"
          </p>
        </div>

        {/* Deadline & Urgency */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Any deadlines or time-sensitive elements?
            </label>
            <input
              type="text"
              value={formData.deadline}
              onChange={(e) => updateField('deadline', e.target.value)}
              placeholder='e.g., "Dec 2026", "Within 6 months", "No rush"'
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              What's the urgency level?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'survival', label: 'Survival', desc: 'Must happen soon' },
                { value: 'growth', label: 'Growth', desc: 'Important but flexible' },
                { value: 'exploratory', label: 'Exploratory', desc: 'Long-term vision' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateField('urgency', option.value)}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition text-left
                    ${formData.urgency === option.value
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blockers */}
        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-sm font-medium mb-2">
            What's blocking you or creating difficulty right now?
          </label>
          <textarea
            value={formData.blockers}
            onChange={(e) => updateField('blockers', e.target.value)}
            placeholder="List challenges, separated by commas"
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: "Tight budget, limited time, market competition, need specific skills"
          </p>
        </div>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        onCancel={onCancel}
        nextLabel={priorityIndex < 2 ? "Next Priority" : "Continue"}
      />
    </div>
  );
}

export default PriorityDetailStep;
