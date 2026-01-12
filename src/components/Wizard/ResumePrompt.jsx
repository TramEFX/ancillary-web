import React from 'react';

function ResumePrompt({ onResume, onStartFresh }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Resume Wizard?</h2>
        
        <p className="text-gray-300 mb-6">
          You have an incomplete initialization in progress. Would you like to continue where you left off, or start over?
        </p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Resume Where I Left Off
          </button>
          
          <button
            onClick={onStartFresh}
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition"
          >
            Start Fresh
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Starting fresh will discard your saved progress
        </p>
      </div>
    </div>
  );
}

export default ResumePrompt;
