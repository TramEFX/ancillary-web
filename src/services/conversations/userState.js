import { writeFile, readFile } from '../github';

/**
 * Load user state from GitHub
 */
export async function loadUserState(githubToken, repoOwner, repoName) {
  try {
    console.log('Loading user state from GitHub...');
    
    const state = await readFile(
      githubToken,
      repoOwner,
      repoName,
      'user_state.json'
    );

    console.log('User state loaded');
    return state;
  } catch (error) {
    // Check if it's a 404 (file doesn't exist)
    if (error.message?.includes('Not Found') || error.status === 404) {
      // File doesn't exist yet, create default
      console.log('No user state found, creating default');
      const defaultState = {
        lastConversationId: null,
        lastUpdated: new Date().toISOString(),
        preferences: {
          sidebarCollapsed: false,
        },
      };
      
      try {
        await saveUserState(githubToken, repoOwner, repoName, defaultState);
        return defaultState;
      } catch (saveError) {
        console.error('Error creating default user state:', saveError);
        return defaultState; // Return default even if save fails
      }
    }
    
    console.error('Error loading user state:', error);
    // Return default state on any error
    return {
      lastConversationId: null,
      lastUpdated: new Date().toISOString(),
      preferences: {
        sidebarCollapsed: false,
      },
    };
  }
}

/**
 * Save user state to GitHub
 */
export async function saveUserState(githubToken, repoOwner, repoName, state) {
  try {
    console.log('Saving user state to GitHub...');
    
    state.lastUpdated = new Date().toISOString();
    
    await writeFile(
      githubToken,
      repoOwner,
      repoName,
      'user_state.json',
      JSON.stringify(state, null, 2),
      'Update user state'
    );

    console.log('User state saved');
    return true;
  } catch (error) {
    console.error('Error saving user state:', error);
    throw error;
  }
}

/**
 * Update last conversation ID
 */
export async function updateLastConversation(
  githubToken,
  repoOwner,
  repoName,
  conversationId
) {
  try {
    const state = await loadUserState(githubToken, repoOwner, repoName);
    state.lastConversationId = conversationId;
    await saveUserState(githubToken, repoOwner, repoName, state);
    
    // Also update localStorage for immediate access
    localStorage.setItem('lastConversationId', conversationId);
    
    return true;
  } catch (error) {
    console.error('Error updating last conversation:', error);
    // Don't throw - just log
    return false;
  }
}

export default {
  loadUserState,
  saveUserState,
  updateLastConversation,
};
