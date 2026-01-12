import { Octokit } from '@octokit/rest';

/**
 * Creates a private repository for the user
 * @param {string} token - GitHub access token
 * @param {string} repoName - Name for the new repository
 * @returns {Promise<object>} Repository object
 */
export async function createPrivateRepo(token, repoName) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
      description: 'Ancillary Protocol manifests - personal AI data',
      auto_init: true, // Initialize with README
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating repo:', error);
    throw error;
  }
}

/**
 * Lists repositories for the authenticated user
 * @param {string} token - GitHub access token
 * @param {object} options - Filter options (type, sort, direction)
 * @returns {Promise<Array>} Array of repository objects
 */
export async function listRepos(token, options = {}) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const response = await octokit.repos.listForAuthenticatedUser({
      type: options.type || 'all',
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing repos:', error);
    throw error;
  }
}

/**
 * Gets information about a specific repository
 * @param {string} token - GitHub access token
 * @param {string} owner - Repository owner (username)
 * @param {string} repo - Repository name
 * @returns {Promise<object>} Repository object
 */
export async function getRepo(token, owner, repo) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const response = await octokit.repos.get({
      owner,
      repo,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting repo:', error);
    throw error;
  }
}

/**
 * Checks if a repository exists
 * @param {string} token - GitHub access token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<boolean>} True if repo exists
 */
export async function repoExists(token, owner, repo) {
  try {
    await getRepo(token, owner, repo);
    return true;
  } catch (error) {
    return false;
  }
}
