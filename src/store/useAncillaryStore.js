import { create } from 'zustand';
import { storage, KEYS } from '../utils/storage';

/**
 * Ancillary Global State Store
 * Manages authentication, user preferences, and application state
 */
const useAncillaryStore = create((set, get) => ({
  // Authentication state
  githubToken: storage.get(KEYS.GITHUB_TOKEN),
  apiKey: storage.get(KEYS.API_KEY),
  llmProvider: storage.get(KEYS.LLM_PROVIDER) || 'claude',
  
  // Repository info
  repoName: storage.get(KEYS.REPO_NAME),
  repoOwner: storage.get(KEYS.REPO_OWNER),
  
  // AI identity
  aiName: storage.get(KEYS.AI_NAME),
  userPrefs: storage.get(KEYS.USER_PREFS) || {},
  
  // Application state
  isInitialized: storage.get(KEYS.REPO_NAME) ? true : false, // If repo exists, we're initialized
  isLoading: false,
  error: null,
  
  // Chat state
  messages: [],
  currentContext: [],
  
  // Actions
  setGithubToken: (token) => {
    storage.set(KEYS.GITHUB_TOKEN, token);
    set({ githubToken: token });
  },
  
  setApiKey: (key) => {
    storage.set(KEYS.API_KEY, key);
    set({ apiKey: key });
  },
  
  setLLMProvider: (provider) => {
    storage.set(KEYS.LLM_PROVIDER, provider);
    set({ llmProvider: provider });
  },
  
  setRepoInfo: (owner, name) => {
    storage.set(KEYS.REPO_OWNER, owner);
    storage.set(KEYS.REPO_NAME, name);
    set({ repoOwner: owner, repoName: name });
  },
  
  setAIName: (name) => {
    storage.set(KEYS.AI_NAME, name);
    set({ aiName: name });
  },
  
  setUserPrefs: (prefs) => {
    storage.set(KEYS.USER_PREFS, prefs);
    set({ userPrefs: prefs });
  },
  
  setInitialized: (value) => set({ isInitialized: value }),
  
  setLoading: (value) => set({ isLoading: value }),
  
  setError: (error) => set({ error }),
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
  
  setContext: (context) => set({ currentContext: context }),
  
  // Utility: Check if user is authenticated (has credentials)
  isAuthenticated: () => {
    const state = get();
    return !!(state.githubToken && state.apiKey);
  },
  
  // Utility: Clear all data (logout)
  logout: () => {
    storage.clear();
    set({
      githubToken: null,
      apiKey: null,
      llmProvider: 'claude',
      repoName: null,
      repoOwner: null,
      aiName: null,
      userPrefs: {},
      isInitialized: false,
      messages: [],
      currentContext: [],
    });
  },
}));

export default useAncillaryStore;
