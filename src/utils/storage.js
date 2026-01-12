// Storage keys used throughout the application
export const KEYS = {
  GITHUB_TOKEN: 'ancillary_github_token',
  API_KEY: 'ancillary_api_key',
  REPO_NAME: 'ancillary_repo_name',
  REPO_OWNER: 'ancillary_repo_owner',
  AI_NAME: 'ancillary_ai_name',
  USER_PREFS: 'ancillary_user_prefs',
  LLM_PROVIDER: 'ancillary_llm_provider', // 'claude' | 'openai' | 'grok'
};

// Storage utility for managing localStorage with JSON serialization
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
};

export default storage;
