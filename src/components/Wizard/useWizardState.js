import { useState, useEffect, useCallback } from 'react';

const WIZARD_STATE_KEY = 'ancillary_wizard_state';
const WIZARD_VERSION = '1.0.0';

/**
 * Initial wizard data structure
 */
const getInitialWizardData = () => ({
  version: WIZARD_VERSION,
  aiName: '',
  creatorName: '',
  repoName: '',
  
  settings: {
    previewManifests: false,
    autoSave: true,
    verbosePrompts: true,
  },
  
  priorities: [
    { name: '', brief: '' },
    { name: '', brief: '' },
    { name: '', brief: '' },
  ],
  
  howAIAddressesCreator: '',
  
  personalityArchetype: {
    reference: null,
    customDescription: '',
    traits: [],
    signatureExpressions: [],
    contextualResponses: {},
  },
  
  communicationStyle: {
    tone: '',
    sentenceLength: '',
    formality: '',
    autonomy: '',
    reasoning: '',
    frustrationResponse: '',
  },
  
  boundaries: {
    forbiddenTopics: [],
    languageComfort: '',
    humorStyle: '',
  },
  
  activationPhrases: {
    professional: '',
    casual: '',
  },
  
  priorityDetails: [
    {
      name: '',
      context: '',
      successCriteria: '',
      peopleInvolved: [],
      deadline: '',
      urgency: '',
      blockers: [],
    },
    {
      name: '',
      context: '',
      successCriteria: '',
      peopleInvolved: [],
      deadline: '',
      urgency: '',
      blockers: [],
    },
    {
      name: '',
      context: '',
      successCriteria: '',
      peopleInvolved: [],
      deadline: '',
      urgency: '',
      blockers: [],
    },
  ],
  
  crossCutting: {
    intersections: '',
    focusChoice: '',
    focusReason: '',
    coreStrength: '',
    visionOneYear: '',
    alwaysRemember: [],
    hardBoundaries: [],
  },
  
  bindingSynthesis: '',
  bindingAccepted: false,
  bindingTimestamp: null,
  
  manifests: {
    generated: false,
    reviewed: false,
    committed: false,
    data: [],
  },
});

/**
 * Wizard state management hook
 */
export function useWizardState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState(getInitialWizardData());
  const [hasResumableState, setHasResumableState] = useState(false);

  // Check for resumable state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(WIZARD_STATE_KEY);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        if (state.status === 'in_progress' && state.version === WIZARD_VERSION) {
          setHasResumableState(true);
        }
      } catch (error) {
        console.error('Error loading wizard state:', error);
        localStorage.removeItem(WIZARD_STATE_KEY);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((step, data) => {
    if (!data.settings?.autoSave) return;
    
    const state = {
      version: WIZARD_VERSION,
      status: 'in_progress',
      currentStep: step,
      lastUpdated: new Date().toISOString(),
      data,
    };
    
    localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(state));
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (wizardData.settings.autoSave && currentStep > 1) {
      saveProgress(currentStep, wizardData);
    }
  }, [wizardData, currentStep, saveProgress]);

  // Resume from saved state
  const resumeWizard = useCallback(() => {
    const savedState = localStorage.getItem(WIZARD_STATE_KEY);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setCurrentStep(state.currentStep);
        setWizardData(state.data);
        setHasResumableState(false);
      } catch (error) {
        console.error('Error resuming wizard:', error);
      }
    }
  }, []);

  // Start fresh
  const startFresh = useCallback(() => {
    localStorage.removeItem(WIZARD_STATE_KEY);
    setWizardData(getInitialWizardData());
    setCurrentStep(1);
    setHasResumableState(false);
  }, []);

  // Update wizard data
  const updateWizardData = useCallback((updates) => {
    setWizardData(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  // Complete wizard
  const completeWizard = useCallback(() => {
    const state = {
      version: WIZARD_VERSION,
      status: 'completed',
      currentStep,
      lastUpdated: new Date().toISOString(),
      data: wizardData,
    };
    
    localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(state));
  }, [currentStep, wizardData]);

  // Cancel wizard
  const cancelWizard = useCallback(() => {
    if (window.confirm('Are you sure you want to cancel? Your progress will be saved and you can resume later.')) {
      saveProgress(currentStep, wizardData);
      return true;
    }
    return false;
  }, [currentStep, wizardData, saveProgress]);

  return {
    currentStep,
    wizardData,
    hasResumableState,
    updateWizardData,
    goToStep,
    nextStep,
    prevStep,
    resumeWizard,
    startFresh,
    completeWizard,
    cancelWizard,
  };
}
