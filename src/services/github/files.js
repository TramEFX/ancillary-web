import { Octokit } from '@octokit/rest';

/**
 * Writes a file to the repository with automatic retry on SHA conflicts
 * Creates new file or updates existing file
 * @param {string} token - GitHub access token
 * @param {string} owner - Repository owner (username)
 * @param {string} repo - Repository name
 * @param {string} path - File path in repo (e.g., 'routing/manifest_index.json')
 * @param {object|string} content - File content (will be JSON stringified if object)
 * @param {string} message - Commit message
 * @param {number} retries - Number of retries on conflict (default: 3)
 * @returns {Promise<object>} Commit info
 */
export async function writeFile(token, owner, repo, path, content, message, retries = 3) {
  const octokit = new Octokit({ auth: token });
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Convert content to JSON string if it's an object
      const fileContent = typeof content === 'object' 
        ? JSON.stringify(content, null, 2) 
        : content;
      
      // Base64 encode the content
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));
      
      // Check if file exists first (need SHA for updates)
      let sha;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });
        sha = data.sha; // File exists, we need the SHA for update
      } catch (error) {
        // File doesn't exist, that's fine
        sha = undefined;
      }
      
      // Create or update the file
      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: message || `Update ${path}`,
        content: encodedContent,
        sha, // Only needed for updates
      });
      
      return response.data;
    } catch (error) {
      // If it's a SHA conflict (409 or 422) and we have retries left, try again
      if ((error.status === 409 || error.status === 422) && attempt < retries) {
        console.log(`SHA conflict on ${path}, retrying (${attempt + 1}/${retries})...`);
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        continue;
      }
      
      console.error('Error writing file:', error);
      throw error;
    }
  }
}

/**
 * Reads a file from the repository
 * @param {string} token - GitHub access token
 * @param {string} owner - Repository owner (username)
 * @param {string} repo - Repository name  
 * @param {string} path - File path in repo
 * @returns {Promise<object>} Parsed JSON content
 */
export async function readFile(token, owner, repo, path) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    
    // Decode base64 content
    const content = decodeURIComponent(escape(atob(data.content)));
    
    // Parse JSON
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

/**
 * Lists files in a directory
 * @param {string} token - GitHub access token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Directory path
 * @returns {Promise<Array>} List of files
 */
export async function listDirectory(token, owner, repo, path) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error listing directory:', error);
    throw error;
  }
}

export default {
  writeFile,
  readFile,
  listDirectory,
};
