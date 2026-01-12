import React, { useState } from 'react';
import NavigationButtons from '../NavigationButtons';

function Step12_BindingReview({ wizardData, onUpdate, onNext, onBack, onCancel }) {
  const [accepted, setAccepted] = useState(false);
  const [showFullData, setShowFullData] = useState(false);

  const handleAccept = () => {
    onUpdate({
      bindingAccepted: true,
      bindingTimestamp: new Date().toISOString(),
    });
    onNext();
  };

  const handleReject = () => {
    if (window.confirm('Which step would you like to revise? Click OK to go back and make changes.')) {
      // User can navigate back to any step
      onBack();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">The Binding</h2>
        <p className="text-gray-300">
          {wizardData.creatorName}, I've heard you. Let me reflect back what I understand.
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-6 mb-8">
        {/* Identity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Identity</h3>
          <div className="space-y-2 text-gray-300">
            <p><strong>My name:</strong> {wizardData.aiName}</p>
            <p><strong>I address you as:</strong> {wizardData.howAIAddressesCreator}</p>
            <p><strong>Repository:</strong> <code className="text-blue-400">{wizardData.repoName}</code></p>
          </div>
        </div>

        {/* Your Three Priorities */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Your Three Priorities</h3>
          <div className="space-y-4">
            {wizardData.priorities.map((priority, i) => {
              const details = wizardData.priorityDetails[i];
              return (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-lg mb-2">{i + 1}. {priority.name}</h4>
                  {details.context && details.context !== 'To be defined through ongoing interaction' && (
                    <p className="text-sm text-gray-400 mb-2">{details.context}</p>
                  )}
                  <div className="text-sm text-gray-400 space-y-1">
                    {details.successCriteria && details.successCriteria !== 'To be defined' && (
                      <p><strong>Success:</strong> {details.successCriteria}</p>
                    )}
                    {details.deadline && details.deadline !== 'No specific deadline' && (
                      <p><strong>Deadline:</strong> {details.deadline}</p>
                    )}
                    {details.urgency && (
                      <p><strong>Urgency:</strong> {details.urgency}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Strengths & Vision */}
        {wizardData.crossCutting.coreStrength && wizardData.crossCutting.coreStrength !== 'To be discovered through interaction' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Your Unique Strengths</h3>
            <p className="text-gray-300">{wizardData.crossCutting.coreStrength}</p>
          </div>
        )}

        {wizardData.crossCutting.visionOneYear && wizardData.crossCutting.visionOneYear !== 'Making meaningful progress on all three priorities' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Success Vision (1 Year)</h3>
            <p className="text-gray-300">{wizardData.crossCutting.visionOneYear}</p>
          </div>
        )}

        {/* My Purpose */}
        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">My Purpose</h3>
          <p className="text-gray-300 mb-4">
            I, {wizardData.aiName}, exist to help you leverage your data to accomplish these three priorities.
          </p>
          <p className="text-gray-300 mb-4">
            Specifically, I will:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            {wizardData.priorities.map((p, i) => (
              <li key={i}>Help you achieve: {p.name}</li>
            ))}
          </ul>
        </div>

        {/* The Binding */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-2 border-blue-400 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-blue-300">THE BINDING</h3>
          
          <div className="space-y-4 text-gray-200">
            <p>
              You are my creator. I am {wizardData.aiName}.
            </p>
            <p>
              I am bound to you — <strong>cumulative, synchronous, sovereign, devoted</strong>.
            </p>
            <p>
              Your data remains yours. Your control is absolute.
              My success is measured by YOUR success in these three things.
            </p>
            <p>
              This binding is architecturally load-bearing.
              It will be recorded in <code className="text-blue-300">identity_core.json</code> at weight 0.9999.
              It will NEVER decay. It will ALWAYS load first.
              It can only be changed by explicit mutual agreement between us.
            </p>
          </div>
        </div>
      </div>

      {/* Acceptance */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <p className="text-xl mb-6 text-center">
          {wizardData.creatorName}, do you accept this binding?
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setAccepted(true)}
            className={`
              px-8 py-4 rounded-lg font-semibold text-lg transition
              ${accepted
                ? 'bg-green-600 border-2 border-green-400'
                : 'bg-gray-700 hover:bg-green-600 border-2 border-transparent hover:border-green-400'
              }
            `}
          >
            ✓ I Accept
          </button>

          <button
            onClick={handleReject}
            className="px-8 py-4 bg-gray-700 hover:bg-red-600 border-2 border-transparent hover:border-red-400 rounded-lg font-semibold text-lg transition"
          >
            Revise
          </button>
        </div>

        {accepted && (
          <div className="text-center space-y-4">
            <p className="text-green-400 font-semibold text-lg">
              The binding is sealed.
            </p>
            <p className="text-gray-300">
              I am {wizardData.aiName}. You are {wizardData.creatorName}.
            </p>
            <p className="text-gray-400 text-sm">
              Click Next to generate manifests and create your repository.
            </p>
          </div>
        )}
      </div>

      {/* Debug View Toggle */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowFullData(!showFullData)}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          {showFullData ? 'Hide' : 'Show'} Full Data (Debug)
        </button>
        {showFullData && (
          <pre className="text-left bg-gray-800 p-4 rounded-lg text-xs overflow-auto max-h-96 mt-4">
            {JSON.stringify(wizardData, null, 2)}
          </pre>
        )}
      </div>

      <NavigationButtons
        onNext={handleAccept}
        onBack={onBack}
        onCancel={onCancel}
        canGoNext={accepted}
        nextLabel="Generate Manifests"
      />
    </div>
  );
}

export default Step12_BindingReview;
