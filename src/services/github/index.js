/**
 * GitHub Service
 * Handles all GitHub API interactions
 */

// Auth operations
export {
  initGitHubAuth,
  getAuthenticatedUser,
  validateToken,
} from './auth.js';

// Repository operations
export {
  createPrivateRepo,
  listRepos,
  getRepo,
  repoExists,
} from './repo.js';

// File operations
export {
  writeFile,
  readFile,
  listDirectory,
} from './files.js';
