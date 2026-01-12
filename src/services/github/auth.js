import { Octokit } from '@octokit/rest';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

/**
 * Initiates GitHub OAuth flow
 * Redirects user to GitHub for authorization
 */
export function initGitHubAuth() {
  const redirectUri = `${window.location.origin}/callback`;
  const scope = 'repo'; // Access to private repos
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  window.location.href = authUrl;
}

/**
 * Gets the authenticated user's information
 * @param {string} token - GitHub access token
 * @returns {Promise<object>} User object with login, name, avatar_url, etc.
 */
export async function getAuthenticatedUser(token) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const response = await octokit.users.getAuthenticated();
    return response.data;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    throw error;
  }
}

/**
 * Validates a GitHub token by attempting to get user info
 * @param {string} token - GitHub access token to validate
 * @returns {Promise<boolean>} True if token is valid
 */
export async function validateToken(token) {
  try {
    await getAuthenticatedUser(token);
    return true;
  } catch (error) {
    return false;
  }
}
