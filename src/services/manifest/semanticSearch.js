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
 * Extract keywords from user message
 */
export function extractKeywords(message) {
  // Convert to lowercase
  const text = message.toLowerCase();
  
  // Remove common words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'what', 'when', 'where', 'who', 'how',
    'tell', 'me', 'about', 'my', 'your', 'i', 'you', 'we', 'they', 'it',
  ]);
  
  // Extract words
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  
  // Filter stop words
  const keywords = words.filter(word => !stopWords.has(word));
  
  // Return unique keywords
  return [...new Set(keywords)];
}

/**
 * Detect if message is asking for specific information
 */
export function detectInformationRequest(message) {
  const lowerMessage = message.toLowerCase();
  
  // Patterns that indicate information requests
  const patterns = [
    /tell me about/i,
    /what (do you know|can you tell me) about/i,
    /what('s| is) (my|the|your)/i,
    /who is/i,
    /when (did|was)/i,
    /where (is|did)/i,
    /how (do|did|can)/i,
    /remind me/i,
    /what happened/i,
  ];
  
  return patterns.some(pattern => pattern.test(message));
}

/**
 * Score manifest relevance to query
 */
export function scoreManifestRelevance(manifest, keywords) {
  let score = 0;
  
  // Check semantic keywords
  if (manifest.semantic_keywords) {
    keywords.forEach(keyword => {
      manifest.semantic_keywords.forEach(manifestKeyword => {
        if (manifestKeyword.toLowerCase().includes(keyword)) {
          score += 2; // Exact match
        } else if (keyword.length > 4 && manifestKeyword.toLowerCase().includes(keyword.substring(0, 4))) {
          score += 0.5; // Partial match
        }
      });
    });
  }
  
  // Check tags
  if (manifest.tags) {
    keywords.forEach(keyword => {
      manifest.tags.forEach(tag => {
        if (tag.toLowerCase().includes(keyword)) {
          score += 1;
        }
      });
    });
  }
  
  // Check path
  keywords.forEach(keyword => {
    if (manifest.path.toLowerCase().includes(keyword)) {
      score += 1;
    }
  });
  
  // Weight multiplier (higher weight = more relevant)
  score *= (1 + (manifest.weight - 0.99) * 10);
  
  return score;
}

/**
 * Search manifests by query
 */
export function searchManifests(manifestIndex, query) {
  // Extract keywords
  const keywords = extractKeywords(query);
  
  if (keywords.length === 0) {
    return [];
  }
  
  console.log('Searching manifests with keywords:', keywords);
  
  // Get manifest list using extraction function
  const manifestsList = extractManifestList(manifestIndex);
  
  if (!manifestsList || manifestsList.length === 0) {
    console.warn('No manifests found in index');
    return [];
  }
  
  console.log(`Searching ${manifestsList.length} manifests`);
  
  // Score each manifest
  const scored = manifestsList.map(manifest => ({
    manifest,
    score: scoreManifestRelevance(manifest, keywords),
  }));
  
  // Filter and sort
  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.manifest);
  
  console.log(`Found ${results.length} relevant manifests`);
  
  return results;
}

/**
 * Detect if additional context is needed
 */
export function needsAdditionalContext(message, loadedManifests) {
  // If asking for information, probably needs context
  if (detectInformationRequest(message)) {
    return true;
  }
  
  // If mentioning specific topics not in loaded manifests
  const keywords = extractKeywords(message);
  
  if (keywords.length > 2) {
    // User is talking about something specific
    return true;
  }
  
  return false;
}

export default {
  extractKeywords,
  detectInformationRequest,
  scoreManifestRelevance,
  searchManifests,
  needsAdditionalContext,
};
