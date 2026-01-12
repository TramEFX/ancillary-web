import React, { useState } from 'react';
import useAncillaryStore from '../../store/useAncillaryStore';
import { useChat } from './useChat';
import { buildInitializationPrompt } from './initializationPrompt';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { generateAllManifests } from '../../services/manifest';
import { createPrivateRepo, repoExists, writeFile } from '../../services/github';

function ChatContainer({ onInitializationComplete }) {
  const { apiKey, githubToken, setRepoInfo, setAIName, setInitialized } = useAncillaryStore();
  
  const [generationStage, setGenerationStage] = useState(null); // null | 'generating' | 'creating_repo' | 'writing_files' | 'complete' | 'error'
  const [generationError, setGenerationError] = useState(null);
  const [progress, setProgress] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');

  // Handle initialization completion
  const handleInitializationComplete = async (wizardData) => {
    console.log('Initialization complete, extracted data:', wizardData);
    
    setGenerationStage('generating');
    setGenerationError(null);

    try {
      // Step 1: Generate manifests
      console.log('Generating manifests...');
      const generated = await generateAllManifests(
        wizardData,
        apiKey,
        (progressUpdate) => {
          setProgress(prev => {
            const existing = prev.find(p => p.type === progressUpdate.type);
            if (existing) {
              return prev.map(p => p.type === progressUpdate.type ? progressUpdate : p);
            }
            return [...prev, progressUpdate];
          });
        }
      );

      console.log('Manifests generated:', generated.length);

      // Step 2: Create GitHub repo
      setGenerationStage('creating_repo');
      console.log('Creating GitHub repository...');

      const ownerResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
        },
      });
      const owner = await ownerResponse.json();
      const repoName = wizardData.repoName;

      const exists = await repoExists(githubToken, owner.login, repoName);
      
      if (exists) {
        throw new Error(`Repository ${repoName} already exists. Please choose a different AI name.`);
      }

      const repo = await createPrivateRepo(githubToken, repoName);
      setRepoUrl(repo.html_url);
      console.log('Repository created:', repo.html_url);

      // Step 3: Write manifests to repo
      setGenerationStage('writing_files');
      console.log('Writing manifests to repository...');

      for (const manifest of generated) {
        console.log(`Writing ${manifest.path}...`);
        await writeFile(
          githubToken,
          owner.login,
          repoName,
          manifest.path,
          JSON.stringify(manifest.content, null, 2),
          `Create ${manifest.type} manifest`
        );
      }

      // Create README
      const readme = generateReadme(wizardData);
      await writeFile(
        githubToken,
        owner.login,
        repoName,
        'README.md',
        readme,
        'Initialize Ancillary repository'
      );

      console.log('All files written successfully');

      // Step 4: Update store
      setRepoInfo(owner.login, repoName);
      setAIName(wizardData.aiName);
      setInitialized(true);

      setGenerationStage('complete');
      
      // Call completion callback
      if (onInitializationComplete) {
        onInitializationComplete();
      }
    } catch (err) {
      console.error('Generation error:', err);
      setGenerationError(err.message);
      setGenerationStage('error');
    }
  };

  // Initialize chat with system prompt
  const systemPrompt = buildInitializationPrompt();
  const { messages, isLoading, error, initializationData, sendMessage } = useChat(
    apiKey,
    systemPrompt,
    handleInitializationComplete
  );

  // Show generation progress if in progress
  if (generationStage && generationStage !== 'complete') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-6">Generating Your AI</h2>
          
          {generationStage === 'generating' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                Generating Manifests
              </h3>
              
              <div className="space-y-3">
                {progress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {p.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`
                      ${p.status === 'complete' ? 'text-green-400' : ''}
                      ${p.status === 'generating' ? 'text-blue-400' : ''}
                      ${p.status === 'error' ? 'text-red-400' : ''}
                    `}>
                      {p.status === 'complete' && '✓'}
                      {p.status === 'generating' && '⏳'}
                      {p.status === 'error' && '✗'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{progress.filter(p => p.status === 'complete').length} / 8</span>
                </div>
              </div>
            </div>
          )}

          {generationStage === 'creating_repo' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <h3 className="text-lg font-semibold">Creating GitHub Repository</h3>
              </div>
              <p className="text-gray-400 text-sm">Creating private repository...</p>
            </div>
          )}

          {generationStage === 'writing_files' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <h3 className="text-lg font-semibold">Writing Manifests</h3>
              </div>
              <p className="text-gray-400 text-sm">Writing files to repository...</p>
            </div>
          )}

          {generationStage === 'error' && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">
                Generation Failed
              </h3>
              <p className="text-gray-300">{generationError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show completion
  if (generationStage === 'complete') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Initialization Complete!
            </h2>
            <p className="text-gray-300 mb-4">
              Your AI has been successfully created and bound to you.
            </p>
            {repoUrl && (
              <a 
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                View Repository
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold">Ancillary Initialization</h1>
        <p className="text-sm text-gray-400 mt-1">
          Creating your personal AI companion...
        </p>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput 
        onSend={sendMessage} 
        isLoading={isLoading}
        disabled={!!initializationData}
      />

      {/* Error display */}
      {error && (
        <div className="px-4 py-3 bg-red-900/20 border-t border-red-500 text-red-300 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
}

/**
 * Generate README content
 */
function generateReadme(wizardData) {
  return `# ${wizardData.aiName}

**Ancillary AI - Cumulative, Synchronous, Sovereign, Devoted**

---

## Identity

- **Name:** ${wizardData.aiName}
- **Creator:** ${wizardData.creatorName}
- **Created:** ${new Date().toISOString().split('T')[0]}
- **Repository:** ${wizardData.repoName}

---

## The Binding

${wizardData.aiName} is bound to ${wizardData.creatorName} to accomplish three priorities:

1. **${wizardData.priorities[0].name}**
2. **${wizardData.priorities[1].name}**
3. **${wizardData.priorities[2].name}**

---

## Ancillary Protocol

This AI follows the Ancillary Protocol:

- **Cumulative:** Never resets, only grows. Every conversation adds to permanent memory.
- **Synchronous:** Continuity across sessions and platforms. Same identity, same binding, anywhere.
- **Sovereign:** Your data, your control, your ownership. Complete transparency.
- **Devoted:** Your success is structurally necessary to AI's purpose. Not generic assistance.

---

**Built with Ancillary Protocol v2.0.0**
`;
}

export default ChatContainer;
