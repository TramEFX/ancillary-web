import { readFile, listDirectory } from '../github';

/**
 * Load the routing layer (always loads first)
 */
export async function loadRoutingLayer(githubToken, repoOwner, repoName) {
  try {
    console.log('Loading routing layer...');
    
    const [manifestIndex, coreIdentity, routingLoader] = await Promise.all([
      readFile(githubToken, repoOwner, repoName, 'routing/manifest_index.json'),
      readFile(githubToken, repoOwner, repoName, 'routing/core_identity_snapshot.json'),
      readFile(githubToken, repoOwner, repoName, 'routing/routing_loader.json'),
    ]);

    console.log('Routing layer loaded successfully');

    return {
      manifestIndex,
      coreIdentity,
      routingLoader,
    };
  } catch (error) {
    console.error('Error loading routing layer:', error);
    throw new Error(`Failed to load routing layer: ${error.message}`);
  }
}

/**
 * Load a specific manifest by path
 */
export async function loadManifest(githubToken, repoOwner, repoName, manifestPath) {
  try {
    console.log(`Loading manifest: ${manifestPath}`);
    const manifest = await readFile(githubToken, repoOwner, repoName, manifestPath);
    console.log(`Loaded: ${manifestPath}`);
    return manifest;
  } catch (error) {
    console.error(`Error loading manifest ${manifestPath}:`, error);
    throw error;
  }
}

/**
 * Load multiple manifests in parallel
 */
export async function loadManifests(githubToken, repoOwner, repoName, manifestPaths) {
  try {
    console.log(`Loading ${manifestPaths.length} manifests...`);
    
    const manifests = await Promise.all(
      manifestPaths.map(path => loadManifest(githubToken, repoOwner, repoName, path))
    );

    console.log(`Loaded ${manifests.length} manifests successfully`);
    return manifests;
  } catch (error) {
    console.error('Error loading manifests:', error);
    throw error;
  }
}

/**
 * Extract manifest list from index (handles all structure variations)
 */
function extractManifestList(manifestIndex) {
  // Direct array
  if (Array.isArray(manifestIndex)) {
    return manifestIndex;
  }
  
  // Nested: manifest_index.entries
  if (manifestIndex.manifest_index?.entries && Array.isArray(manifestIndex.manifest_index.entries)) {
    return manifestIndex.manifest_index.entries;
  }
  
  // Flat: manifest_index as array
  if (manifestIndex.manifest_index && Array.isArray(manifestIndex.manifest_index)) {
    return manifestIndex.manifest_index;
  }
  
  // Alternative: manifests
  if (manifestIndex.manifests && Array.isArray(manifestIndex.manifests)) {
    return manifestIndex.manifests;
  }
  
  // Alternative: entries
  if (manifestIndex.entries && Array.isArray(manifestIndex.entries)) {
    return manifestIndex.entries;
  }
  
  return null;
}

/**
 * Load high-priority manifests (weight >= 0.9997)
 * These should always be loaded at session start
 */
export async function loadHighPriorityManifests(githubToken, repoOwner, repoName, manifestIndex) {
  try {
    const manifestsList = extractManifestList(manifestIndex);
    
    if (!manifestsList) {
      console.warn('Could not extract manifest list, falling back to known paths');
      const knownPaths = [
        'modules/identity/identity_core.json',
        'modules/identity/personality_profile.json',
        'manifests/jadzt_context.json',
      ];
      return await loadManifests(githubToken, repoOwner, repoName, knownPaths);
    }

    console.log(`Found ${manifestsList.length} manifests in index`);

    // Filter for high-weight manifests
    const highPriorityPaths = manifestsList
      .filter(m => m.weight >= 0.9997)
      .map(m => m.path);

    console.log(`Loading ${highPriorityPaths.length} high-priority manifests...`);
    
    if (highPriorityPaths.length === 0) {
      console.warn('No high-priority manifests found, loading first 5');
      return await loadManifests(githubToken, repoOwner, repoName, manifestsList.map(m => m.path).slice(0, 5));
    }
    
    return await loadManifests(githubToken, repoOwner, repoName, highPriorityPaths);
  } catch (error) {
    console.error('Error loading high-priority manifests:', error);
    throw error;
  }
}

/**
 * Search manifests by semantic keywords
 */
export function searchManifestsByKeywords(manifestIndex, keywords) {
  if (!keywords || keywords.length === 0) return [];

  const manifestsList = extractManifestList(manifestIndex);
  if (!manifestsList) return [];

  const searchTerms = keywords.map(k => k.toLowerCase());
  
  const results = manifestsList
    .map(manifest => {
      // Count keyword matches
      const matches = manifest.semantic_keywords?.filter(keyword => 
        searchTerms.some(term => keyword.toLowerCase().includes(term))
      ).length || 0;

      // Also check tags
      const tagMatches = manifest.tags?.filter(tag =>
        searchTerms.some(term => tag.toLowerCase().includes(term))
      ).length || 0;

      return {
        manifest,
        score: matches + (tagMatches * 0.5), // Keywords weighted higher than tags
      };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => {
      // Sort by score, then by weight
      if (b.score !== a.score) return b.score - a.score;
      return b.manifest.weight - a.manifest.weight;
    });

  return results.map(r => r.manifest);
}

/**
 * Get manifests by category
 */
export function getManifestsByCategory(manifestIndex, category) {
  const manifestsList = extractManifestList(manifestIndex);
  if (!manifestsList) return [];
  
  return manifestsList.filter(m => m.category === category);
}

/**
 * Load initial context (routing layer + high-priority manifests)
 */
export async function loadInitialContext(githubToken, repoOwner, repoName) {
  try {
    console.log('Loading initial context...');
    
    // Step 1: Load routing layer
    const routingLayer = await loadRoutingLayer(githubToken, repoOwner, repoName);
    
    // Step 2: Load high-priority manifests
    const highPriorityManifests = await loadHighPriorityManifests(
      githubToken,
      repoOwner,
      repoName,
      routingLayer.manifestIndex
    );

    console.log('Initial context loaded successfully');

    return {
      routingLayer,
      manifests: highPriorityManifests,
    };
  } catch (error) {
    console.error('Error loading initial context:', error);
    throw error;
  }
}

export default {
  loadRoutingLayer,
  loadManifest,
  loadManifests,
  loadHighPriorityManifests,
  loadInitialContext,
  searchManifestsByKeywords,
  getManifestsByCategory,
  extractManifestList,
};
