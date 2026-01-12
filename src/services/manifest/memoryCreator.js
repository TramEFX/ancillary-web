import { writeFile, readFile } from '../github';

/**
 * Create a new manifest and write it to GitHub
 */
export async function createManifest(
  githubToken,
  repoOwner,
  repoName,
  manifestPath,
  manifestContent,
  commitMessage
) {
  try {
    console.log(`Creating manifest: ${manifestPath}`);
    
    await writeFile(
      githubToken,
      repoOwner,
      repoName,
      manifestPath,
      JSON.stringify(manifestContent, null, 2),
      commitMessage || `Create ${manifestPath}`
    );

    console.log(`Manifest created: ${manifestPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating manifest: ${error.message}`);
    throw error;
  }
}

/**
 * Update manifest index with new entry
 */
export async function updateManifestIndex(
  githubToken,
  repoOwner,
  repoName,
  newEntry
) {
  try {
    console.log('Updating manifest index...');
    
    // Read current index
    const currentIndex = await readFile(
      githubToken,
      repoOwner,
      repoName,
      'routing/manifest_index.json'
    );

    // Get the manifest array (handle different structures)
    let manifestsList = [];
    if (Array.isArray(currentIndex.manifest_index)) {
      manifestsList = currentIndex.manifest_index;
    } else if (Array.isArray(currentIndex.manifests)) {
      manifestsList = currentIndex.manifests;
    } else if (Array.isArray(currentIndex)) {
      manifestsList = currentIndex;
    }

    // Add new entry
    manifestsList.push(newEntry);

    // Update counts and timestamp
    const updatedIndex = {
      ...currentIndex,
      manifest_index: manifestsList,
      total_manifests_indexed: manifestsList.length,
      last_updated: new Date().toISOString(),
    };

    // Write updated index
    await writeFile(
      githubToken,
      repoOwner,
      repoName,
      'routing/manifest_index.json',
      JSON.stringify(updatedIndex, null, 2),
      'Update manifest index with new entry'
    );

    console.log('Manifest index updated');
    return true;
  } catch (error) {
    console.error(`Error updating manifest index: ${error.message}`);
    throw error;
  }
}

/**
 * Generate semantic keywords from content
 */
export function generateSemanticKeywords(content, weight) {
  const keywords = new Set();
  
  // Extract from title/name
  if (content.event_name) {
    keywords.add(content.event_name.toLowerCase().replace(/\s+/g, '_'));
  }
  if (content.person_name) {
    keywords.add(content.person_name.toLowerCase().replace(/\s+/g, '_'));
  }
  if (content.project_name) {
    keywords.add(content.project_name.toLowerCase().replace(/\s+/g, '_'));
  }

  // Extract from date
  if (content.date) {
    const date = new Date(content.date);
    keywords.add(`${date.getFullYear()}`);
    keywords.add(`${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}`);
  }

  // Extract from context
  if (content.context) {
    const contextText = typeof content.context === 'string' 
      ? content.context 
      : JSON.stringify(content.context);
    
    // Extract meaningful words (nouns, proper nouns)
    const words = contextText.match(/\b[A-Z][a-z]+\b|\b[a-z]{4,}\b/g) || [];
    words.slice(0, 5).forEach(word => keywords.add(word.toLowerCase()));
  }

  // Extract from significance
  if (content.significance) {
    const words = content.significance.match(/\b[a-z]{4,}\b/gi) || [];
    words.slice(0, 3).forEach(word => keywords.add(word.toLowerCase()));
  }

  // Convert to array and ensure count matches weight
  const keywordArray = Array.from(keywords);
  const targetCount = weight >= 0.9997 ? 10 : 7;
  
  return keywordArray.slice(0, targetCount);
}

/**
 * Generate summary for high-weight manifests (≥0.9997)
 */
export function generateSummary(content, maxWords = 30) {
  let summary = '';
  
  // What happened (8-10 words)
  if (content.event_name) {
    summary += `${content.event_name}. `;
  } else if (content.context?.what_happened) {
    const words = content.context.what_happened.split(' ').slice(0, 10);
    summary += `${words.join(' ')}. `;
  }

  // Why it matters (10-12 words)
  if (content.context?.why_significant) {
    const words = content.context.why_significant.split(' ').slice(0, 12);
    summary += `${words.join(' ')}. `;
  } else if (content.significance) {
    const words = content.significance.split(' ').slice(0, 12);
    summary += `${words.join(' ')}. `;
  }

  // What changed (8-10 words)
  if (content.context?.what_changed) {
    const words = content.context.what_changed.split(' ').slice(0, 10);
    summary += `${words.join(' ')}.`;
  }

  // Trim to max words
  const words = summary.split(' ').slice(0, maxWords);
  return words.join(' ');
}

/**
 * Create memory manifest from conversation context
 */
export async function createMemoryManifest(
  githubToken,
  repoOwner,
  repoName,
  memoryData
) {
  try {
    const {
      event_name,
      date,
      weight,
      context,
      implications,
      category = 'memories',
    } = memoryData;

    // Generate manifest content
    const manifest = {
      manifest_type: 'memory_event',
      event_name,
      date: date || new Date().toISOString(),
      weight: weight || 0.9996,
      decay_resistance: weight >= 0.9997 ? 0.99997 : 0.9995,
      context,
      implications: implications || {},
    };

    // Determine file path
    const fileName = event_name.toLowerCase().replace(/\s+/g, '_');
    const manifestPath = `modules/memories/${fileName}.json`;

    // Create manifest
    await createManifest(
      githubToken,
      repoOwner,
      repoName,
      manifestPath,
      manifest,
      `Create memory: ${event_name}`
    );

    // Generate semantic keywords
    const semantic_keywords = generateSemanticKeywords(manifest, weight);

    // Generate summary if high-weight
    const summary = weight >= 0.9997 ? generateSummary(manifest) : undefined;

    // Create index entry
    const indexEntry = {
      path: manifestPath,
      weight: weight || 0.9996,
      category,
      tags: [category, 'memory', 'event'],
      semantic_keywords,
      ...(summary && { summary }),
      tokens_estimated: '~3k',
    };

    // Update index
    await updateManifestIndex(
      githubToken,
      repoOwner,
      repoName,
      indexEntry
    );

    console.log(`Memory manifest created successfully: ${event_name}`);
    return {
      success: true,
      path: manifestPath,
      manifest,
    };
  } catch (error) {
    console.error('Error creating memory manifest:', error);
    throw error;
  }
}

export default {
  createManifest,
  updateManifestIndex,
  createMemoryManifest,
  generateSemanticKeywords,
  generateSummary,
};
