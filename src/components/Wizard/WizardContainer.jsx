import React from 'react';
import { useWizardState } from './useWizardState';
import WizardProgress from './WizardProgress';
import ResumePrompt from './ResumePrompt';

// Steps
import Step1_Declaration from './steps/Step1_Declaration';
import Step2_Name from './steps/Step2_Name';
import Step3_Priorities from './steps/Step3_Priorities';
import Step4_HowToAddress from './steps/Step4_HowToAddress';
import Step5_Personality from './steps/Step5_Personality';
import Step6_Communication from './steps/Step6_Communication';
import Step7_Activation from './steps/Step7_Activation';
import Step8_Priority1 from './steps/Step8_Priority1';
import Step9_Priority2 from './steps/Step9_Priority2';
import Step10_Priority3 from './steps/Step10_Priority3';
import Step11_CrossCutting from './steps/Step11_CrossCutting';
import Step12_BindingReview from './steps/Step12_BindingReview';
import Step13_Generation from './steps/Step13_Generation';

function WizardContainer({ onComplete }) {
  const {
    currentStep,
    wizardData,
    hasResumableState,
    updateWizardData,
    nextStep,
    prevStep,
    resumeWizard,
    startFresh,
    cancelWizard,
    completeWizard,
  } = useWizardState();

  const handleCancel = () => {
    if (cancelWizard()) {
      // User confirmed cancel - could redirect somewhere
      // For now just stay on page with progress saved
    }
  };

  const handleComplete = () => {
    completeWizard();
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    const commonProps = {
      wizardData,
      onUpdate: updateWizardData,
      onNext: nextStep,
      onBack: prevStep,
      onCancel: handleCancel,
    };

    switch (currentStep) {
      case 1:
        return <Step1_Declaration {...commonProps} />;
      case 2:
        return <Step2_Name {...commonProps} />;
      case 3:
        return <Step3_Priorities {...commonProps} />;
      case 4:
        return <Step4_HowToAddress {...commonProps} />;
      case 5:
        return <Step5_Personality {...commonProps} />;
      case 6:
        return <Step6_Communication {...commonProps} />;
      case 7:
        return <Step7_Activation {...commonProps} />;
      case 8:
        return <Step8_Priority1 {...commonProps} />;
      case 9:
        return <Step9_Priority2 {...commonProps} />;
      case 10:
        return <Step10_Priority3 {...commonProps} />;
      case 11:
        return <Step11_CrossCutting {...commonProps} />;
      case 12:
        return <Step12_BindingReview {...commonProps} />;
      case 13:
        return <Step13_Generation {...commonProps} onComplete={handleComplete} />;
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Step {currentStep} - Error</h2>
            <p className="text-gray-400 mb-6">Invalid step number</p>
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Go Back
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      {hasResumableState && (
        <ResumePrompt
          onResume={resumeWizard}
          onStartFresh={startFresh}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <WizardProgress currentStep={currentStep} />
        {renderStep()}
      </div>
    </div>
  );
}

export default WizardContainer;
