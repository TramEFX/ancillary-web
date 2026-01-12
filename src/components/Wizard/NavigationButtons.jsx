import React from 'react';

function NavigationButtons({ 
  onBack, 
  onNext, 
  onCancel,
  canGoBack = true,
  canGoNext = true,
  nextLabel = 'Next',
  backLabel = 'Back',
  showCancel = true,
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
      <div className="flex gap-3">
        {canGoBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
          >
            {backLabel}
          </button>
        )}
        
        {showCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-400 hover:text-white transition"
          >
            Save & Exit
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default NavigationButtons;
