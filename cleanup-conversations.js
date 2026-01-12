/**
 * Cleanup orphaned conversation files
 * 
 * Run this in browser console to remove duplicate conversation files.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy/paste this entire script
 * 3. Press Enter
 * 4. Script will identify and delete orphaned files
 */

(async function cleanupConversations() {
  console.log('🧹 Starting conversation cleanup...');
  
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
      throw new Error(`Failed to list files: ${response.statusText}`);
    }
    
    const files = await response.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));
    
    console.log(`📁 Found ${jsonFiles.length} conversation files`);
    
    // Group by conversation ID
    const grouped = {};
    jsonFiles.forEach(file => {
      const id = file.name.split('_')[0];
      if (!grouped[id]) {
        grouped[id] = [];
      }
      grouped[id].push(file);
    });
    
    // Find duplicates
    const toDelete = [];
    Object.entries(grouped).forEach(([id, files]) => {
      if (files.length > 1) {
        console.log(`🔍 Found ${files.length} files for conversation ${id}:`);
        files.forEach(f => console.log(`   - ${f.name}`));
        
        // Sort by last modified, keep newest
        files.sort((a, b) => {
          // Files don't have modified time in list, so use name length as proxy
          // (newer auto-generated titles are usually longer/more specific)
          return b.name.length - a.name.length;
        });
        
        // Keep first (newest), delete rest
        const keep = files[0];
        const deleteFiles = files.slice(1);
        
        console.log(`   ✅ Keeping: ${keep.name}`);
        deleteFiles.forEach(f => {
          console.log(`   🗑️  Will delete: ${f.name}`);
          toDelete.push(f);
        });
      }
    });
    
    if (toDelete.length === 0) {
      console.log('✨ No orphaned files found. All clean!');
      return;
    }
    
    console.log(`\n⚠️  About to delete ${toDelete.length} orphaned file(s)`);
    const confirm = window.confirm(
      `Delete ${toDelete.length} orphaned conversation file(s)?\n\n` +
      toDelete.map(f => f.name).join('\n')
    );
    
    if (!confirm) {
      console.log('❌ Cleanup cancelled');
      return;
    }
    
    // Delete orphaned files
    console.log('\n🗑️  Deleting orphaned files...');
    for (const file of toDelete) {
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
              message: `Cleanup: Remove orphaned file ${file.name}`,
              sha: file.sha,
            }),
          }
        );
        
        if (deleteResponse.ok) {
          console.log(`   ✅ Deleted: ${file.name}`);
        } else {
          console.error(`   ❌ Failed to delete ${file.name}: ${deleteResponse.statusText}`);
        }
      } catch (error) {
        console.error(`   ❌ Error deleting ${file.name}:`, error);
      }
    }
    
    console.log('\n✨ Cleanup complete!');
    console.log('🔄 Refresh the page to see updated conversation list');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
})();
