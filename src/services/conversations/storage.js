import { writeFile, readFile, listDirectory } from '../github';

/**
 * List all conversations from GitHub
 */
export async function listConversations(githubToken, repoOwner, repoName) {
  try {
    console.log('Fetching conversation list from GitHub...');
    
    // List files in conversations/ directory
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/conversations`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Directory doesn't exist yet
        console.log('No conversations directory found - first time setup');
        return [];
      }
      throw new Error(`Failed to list conversations: ${response.statusText}`);
    }

    const files = await response.json();
    
    // Filter for JSON files
    const conversations = [];
    
    for (const file of files.filter(f => f.name.endsWith('.json'))) {
      try {
        // Read the file to get the title
        const conversation = await readFile(
          githubToken,
          repoOwner,
          repoName,
          file.path
        );
        
        conversations.push({
          id: conversation.id,
          title: conversation.title || 'Untitled',
          path: file.path,
          sha: file.sha,
          updated: conversation.updated,
        });
      } catch (error) {
        console.warn(`Failed to read ${file.name}:`, error);
      }
    }
    
    // Sort by updated time (newest first)
    conversations.sort((a, b) => 
      new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime()
    );

    console.log(`Found ${conversations.length} conversations`);
    return conversations;
  } catch (error) {
    console.error('Error listing conversations:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}

/**
 * Load a specific conversation from GitHub
 * Supports both old format (with title) and new format (ID only)
 */
export async function loadConversation(githubToken, repoOwner, repoName, conversationId) {
  try {
    console.log(`Loading conversation: ${conversationId}`);
    
    // Try new format first (just ID)
    const newFormatPath = `conversations/${conversationId}.json`;
    
    try {
      const conversation = await readFile(
        githubToken,
        repoOwner,
        repoName,
        newFormatPath
      );
      console.log(`Loaded conversation with ${conversation.messages?.length || 0} messages`);
      return conversation;
    } catch (error) {
      // If new format fails, try old format (ID_title.json)
      if (error.status === 404) {
        console.log('New format not found, checking for old format...');
        
        // List all files and find one starting with this ID
        const files = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/conversations`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        
        if (files.ok) {
          const fileList = await files.json();
          const oldFormatFile = fileList.find(f => 
            f.name.startsWith(conversationId) && f.name.endsWith('.json')
          );
          
          if (oldFormatFile) {
            console.log(`Found old format file: ${oldFormatFile.name}`);
            const conversation = await readFile(
              githubToken,
              repoOwner,
              repoName,
              oldFormatFile.path
            );
            console.log(`Loaded conversation with ${conversation.messages?.length || 0} messages`);
            return conversation;
          }
        }
      }
      
      // If both formats fail, throw original error
      throw error;
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
    throw error;
  }
}

/**
 * Save conversation to GitHub
 * Filename is just the ID - title is stored in JSON
 * Automatically migrates old format files to new format
 */
export async function saveConversation(
  githubToken,
  repoOwner,
  repoName,
  conversation
) {
  try {
    console.log(`Saving conversation: ${conversation.id}`);
    
    // New format filename: just the ID
    const newFilename = `${conversation.id}.json`;
    const newPath = `conversations/${newFilename}`;

    // Update timestamp
    conversation.updated = new Date().toISOString();

    // Check if an old format file exists (migration)
    try {
      const files = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/conversations`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      
      if (files.ok) {
        const fileList = await files.json();
        const oldFormatFile = fileList.find(f => 
          f.name.startsWith(conversation.id) && 
          f.name !== newFilename && 
          f.name.endsWith('.json')
        );
        
        // If old format file exists, delete it (migration)
        if (oldFormatFile) {
          console.log(`Migrating from old format: ${oldFormatFile.name} → ${newFilename}`);
          try {
            await fetch(
              `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${oldFormatFile.path}`,
              {
                method: 'DELETE',
                headers: {
                  'Authorization': `token ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                  message: `Migrate to new format: ${oldFormatFile.name}`,
                  sha: oldFormatFile.sha,
                }),
              }
            );
            console.log('Old format file deleted');
          } catch (err) {
            console.warn('Failed to delete old format file (non-critical):', err);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to check for old format files (non-critical):', err);
    }

    // Save to GitHub (new format)
    await writeFile(
      githubToken,
      repoOwner,
      repoName,
      newPath,
      JSON.stringify(conversation, null, 2),
      `Update conversation: ${conversation.title}`
    );

    console.log('Conversation saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

/**
 * Create new conversation
 */
export async function createConversation(
  githubToken,
  repoOwner,
  repoName,
  title = 'New Conversation'
) {
  try {
    const id = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    
    const conversation = {
      id,
      title,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      messages: [],
      messageCount: 0,
      summary: null,
    };

    await saveConversation(githubToken, repoOwner, repoName, conversation);
    
    console.log('New conversation created:', id);
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

/**
 * Delete conversation
 * Supports both old format (with title) and new format (ID only)
 */
export async function deleteConversation(
  githubToken,
  repoOwner,
  repoName,
  conversationId
) {
  try {
    console.log(`Deleting conversation: ${conversationId}`);
    
    // Try new format first
    let path = `conversations/${conversationId}.json`;
    let fileInfo = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    
    // If new format not found, try old format
    if (!fileInfo.ok && fileInfo.status === 404) {
      console.log('New format not found, checking for old format...');
      
      const files = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/conversations`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      
      if (files.ok) {
        const fileList = await files.json();
        const oldFormatFile = fileList.find(f => 
          f.name.startsWith(conversationId) && f.name.endsWith('.json')
        );
        
        if (oldFormatFile) {
          path = oldFormatFile.path;
          // Re-fetch to get SHA
          fileInfo = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
            {
              headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );
        }
      }
    }
    
    if (!fileInfo.ok) {
      throw new Error(`Conversation file not found: ${conversationId}`);
    }
    
    const file = await fileInfo.json();

    // Delete the file
    await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `Delete conversation: ${conversationId}`,
          sha: file.sha,
        }),
      }
    );

    console.log('Conversation deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

/**
 * Cache conversation list in localStorage
 */
export function cacheConversationList(conversations) {
  try {
    localStorage.setItem('conversationListCache', JSON.stringify(conversations));
    localStorage.setItem('conversationListLastFetch', new Date().toISOString());
  } catch (error) {
    console.error('Error caching conversation list:', error);
  }
}

/**
 * Get cached conversation list
 */
export function getCachedConversationList() {
  try {
    const cached = localStorage.getItem('conversationListCache');
    const lastFetch = localStorage.getItem('conversationListLastFetch');
    
    if (!cached || !lastFetch) return null;
    
    // Check if cache is stale (older than 5 minutes)
    const age = Date.now() - new Date(lastFetch).getTime();
    if (age > 5 * 60 * 1000) {
      return null; // Stale
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading conversation cache:', error);
    return null;
  }
}

/**
 * Get/Set last active conversation
 */
export function getLastConversationId() {
  return localStorage.getItem('lastConversationId');
}

export function setLastConversationId(conversationId) {
  localStorage.setItem('lastConversationId', conversationId);
}

/**
 * Rename a conversation (just update the title in JSON)
 */
export async function renameConversation(
  githubToken,
  repoOwner,
  repoName,
  conversationId,
  newTitle
) {
  try {
    console.log(`Renaming conversation ${conversationId} to: ${newTitle}`);
    
    // Load conversation
    const conversation = await loadConversation(githubToken, repoOwner, repoName, conversationId);
    
    // Update title
    conversation.title = newTitle;
    
    // Save (same filename, just updated JSON)
    await saveConversation(githubToken, repoOwner, repoName, conversation);
    
    console.log('Conversation renamed successfully');
    return true;
  } catch (error) {
    console.error('Error renaming conversation:', error);
    return false;
  }
}

/**
 * Generate a title from the first user message
 */
export function generateTitleFromMessage(message) {
  if (!message || !message.trim()) return 'New Conversation';
  
  // Take first 50 chars, cut at word boundary
  let title = message.trim().substring(0, 50);
  
  // If we cut mid-word, trim to last complete word
  if (message.length > 50) {
    const lastSpace = title.lastIndexOf(' ');
    if (lastSpace > 0) {
      title = title.substring(0, lastSpace);
    }
    title += '...';
  }
  
  return title;
}

export default {
  listConversations,
  loadConversation,
  saveConversation,
  createConversation,
  deleteConversation,
  renameConversation,
  generateTitleFromMessage,
  cacheConversationList,
  getCachedConversationList,
  getLastConversationId,
  setLastConversationId,
};
