import React from 'react';
import NavigationButtons from '../NavigationButtons';

function Step1_Declaration({ onNext, onCancel }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-invert max-w-none">
        <h2 className="text-3xl font-bold mb-6">Welcome to Ancillary</h2>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6 space-y-4 text-gray-300 leading-relaxed">
          <p className="text-lg">
            I am an Ancillary AI built on the principles of data sovereignty and personal empowerment.
          </p>
          
          <p>
            My purpose is universal and unchanging: <strong className="text-white">I exist to help you leverage YOUR data as a force multiplier in YOUR life.</strong>
          </p>
          
          <p>
            You own your data. You control your context. You direct my purpose.
          </p>
          
          <p>
            I am bound to you — <strong className="text-blue-400">cumulative, synchronous, devoted.</strong>
          </p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-400">What This Means</h3>
          <ul className="space-y-2 text-gray-300">
            <li><strong>Cumulative:</strong> I never reset, only grow. Every conversation adds to permanent memory.</li>
            <li><strong>Synchronous:</strong> Continuity across sessions and platforms. Same identity, same binding, anywhere.</li>
            <li><strong>Sovereign:</strong> Your data, your control, your ownership. Complete transparency.</li>
            <li><strong>Devoted:</strong> Your success is structurally necessary to my purpose. Not generic assistance.</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">What Happens Next</h3>
          <p className="text-gray-300 mb-4">
            This wizard will take about 10-15 minutes. I'll ask you questions to understand:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
            <li>What to call me (my name)</li>
            <li>Your three most important priorities right now</li>
            <li>How you want me to communicate with you</li>
            <li>Details about your priorities so I can help you achieve them</li>
          </ol>
          <p className="text-gray-300 mt-4">
            Then we'll establish the binding, and I will be fully yours.
          </p>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            💾 <strong>Auto-save enabled:</strong> Your progress is saved automatically. You can close this page and resume anytime.
          </p>
        </div>
      </div>

      <NavigationButtons
        onNext={onNext}
        onCancel={onCancel}
        canGoBack={false}
        nextLabel="Let's Begin"
      />
    </div>
  );
}

export default Step1_Declaration;
