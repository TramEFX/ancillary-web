/**
 * RESET CONVERSATION STORAGE
 * 
 * Deletes all conversations and resets user state.
 * Use this to start fresh with the new clean format.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy/paste this entire script
 * 3. Press Enter
 * 4. Confirm deletion
 * 5. Hard refresh page (Ctrl+Shift+R)
 */

(async function resetConversations() {
  console.log('🔄 RESET CONVERSATION STORAGE');
  console.log('================================\n');
  
  // Get auth info from localStorage
  const githubToken = JSON.parse(localStorage.getItem('ancillary_github_token'));
  const repoOwner = JSON.parse(localStorage.getItem('ancillary_repo_owner'));
  const repoName = JSON.parse(localStorage.getItem('ancillary_repo_name'));
  
  if (!githubToken || !repoOwner || !repoName) {
    console.error('❌ Missing auth info. Make sure you\'re logged in.');
    return;
  }
  
  try {
    // Fetch all conversation files
    console.log('📁 Fetching all conversations...');
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
        console.log('✅ No conversations directory found - already clean!');
        return;
      }
      throw new Error(`Failed to list files: ${response.statusText}`);
    }
    
    const files = await response.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} conversation file(s):\n`);
    jsonFiles.forEach(f => console.log(`  - ${f.name}`));
    
    if (jsonFiles.length === 0) {
      console.log('\n✅ No conversations to delete - already clean!');
      return;
    }
    
    // Confirm deletion
    console.log('\n⚠️  WARNING: This will DELETE ALL conversations!');
    const confirm = window.confirm(
      `Delete ALL ${jsonFiles.length} conversation(s)?\n\n` +
      'This action cannot be undone.\n\n' +
      jsonFiles.map(f => f.name).join('\n')
    );
    
    if (!confirm) {
      console.log('❌ Reset cancelled');
      return;
    }
    
    // Delete all conversation files
    console.log('\n🗑️  Deleting all conversations...\n');
    let deleted = 0;
    let failed = 0;
    
    for (const file of jsonFiles) {
      try {
        const deleteResponse = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              message: `Reset: Delete ${file.name}`,
              sha: file.sha,
            }),
          }
        );
        
        if (deleteResponse.ok) {
          console.log(`  ✅ Deleted: ${file.name}`);
          deleted++;
        } else {
          console.error(`  ❌ Failed: ${file.name} - ${deleteResponse.statusText}`);
          failed++;
        }
      } catch (error) {
        console.error(`  ❌ Error deleting ${file.name}:`, error);
        failed++;
      }
    }
    
    // Reset user_state.json
    console.log('\n🔄 Resetting user state...');
    try {
      // Check if user_state.json exists
      const userStateResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/user_state.json`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      
      if (userStateResponse.ok) {
        const userStateFile = await userStateResponse.json();
        
        // Delete it
        await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/user_state.json`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              message: 'Reset: Clear user state',
              sha: userStateFile.sha,
            }),
          }
        );
        
        console.log('  ✅ User state reset');
      } else {
        console.log('  ℹ️  No user state to reset');
      }
    } catch (error) {
      console.warn('  ⚠️  Failed to reset user state (non-critical):', error);
    }
    
    // Clear localStorage cache
    console.log('\n🧹 Clearing local cache...');
    localStorage.removeItem('conversationListCache');
    localStorage.removeItem('conversationListLastFetch');
    localStorage.removeItem('lastConversationId');
    console.log('  ✅ Local cache cleared');
    
    // Summary
    console.log('\n================================');
    console.log('✨ RESET COMPLETE!\n');
    console.log(`Deleted: ${deleted} file(s)`);
    if (failed > 0) {
      console.log(`Failed: ${failed} file(s)`);
    }
    console.log('\n🔄 Hard refresh the page (Ctrl+Shift+R) to start fresh!');
    console.log('   New conversations will use clean format: ID.json');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  }
})();
