import React from 'react';

const PHASES = [
  { name: 'Foundation', steps: [1, 2, 3] },
  { name: 'Identity', steps: [4, 5, 6, 7] },
  { name: 'Priorities', steps: [8, 9, 10, 11] },
  { name: 'Binding', steps: [12] },
  { name: 'Generation', steps: [13] },
];

function WizardProgress({ currentStep, totalSteps = 13 }) {
  const currentPhase = PHASES.find(phase => phase.steps.includes(currentStep));
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Current phase label */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
          {currentPhase && (
            <span className="text-blue-400 font-medium">
              Phase: {currentPhase.name}
            </span>
          )}
        </div>
      </div>

      {/* Phase indicators */}
      <div className="mt-4 flex justify-between">
        {PHASES.map((phase, index) => {
          const isActive = phase.steps.includes(currentStep);
          const isComplete = Math.max(...phase.steps) < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${isComplete ? 'bg-green-600' : isActive ? 'bg-blue-600' : 'bg-gray-700'}
              `}>
                {isComplete ? '✓' : index + 1}
              </div>
              <span className={`
                mt-1 text-xs
                ${isActive ? 'text-blue-400' : isComplete ? 'text-green-400' : 'text-gray-500'}
              `}>
                {phase.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WizardProgress;
