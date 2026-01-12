import React, { useState, useEffect } from 'react';
import useAncillaryStore from '../../../store/useAncillaryStore';
import { generateAllManifests } from '../../../services/manifest';
import { createPrivateRepo, repoExists, writeFile } from '../../../services/github';

function Step13_Generation({ wizardData, onUpdate, onComplete }) {
  const { githubToken, apiKey, setRepoInfo, setAIName } = useAncillaryStore();
  
  const [stage, setStage] = useState('ready'); // ready | generating | creating_repo | writing_files | complete | error
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [manifests, setManifests] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');

  const handleGenerate = async () => {
    setError(null);
    setStage('generating');

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

      setManifests(generated);
      console.log('Manifests generated:', generated.length);

      // Step 2: Create GitHub repo
      setStage('creating_repo');
      console.log('Creating GitHub repository...');

      // Check if repo already exists
      const ownerResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
        },
      });
      const owner = await ownerResponse.json();
      const repoName = wizardData.repoName;

      const exists = await repoExists(githubToken, owner.login, repoName);
      
      if (exists) {
        throw new Error(`Repository ${repoName} already exists. Please choose a different AI name or delete the existing repository.`);
      }

      const repo = await createPrivateRepo(githubToken, repoName);
      setRepoUrl(repo.html_url);
      console.log('Repository created:', repo.html_url);

      // Step 3: Write manifests to repo
      setStage('writing_files');
      console.log('Writing manifests to repository...');

      // Create directory structure first (GitHub automatically creates dirs with files)
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

      // Update wizard data with manifests
      onUpdate({
        manifests: {
          generated: true,
          reviewed: false,
          committed: true,
          data: generated,
        },
      });

      setStage('complete');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setStage('error');
    }
  };

  const handleRetry = () => {
    setStage('ready');
    setProgress([]);
    setError(null);
    setManifests([]);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Generating Your AI</h2>
        <p className="text-gray-300">
          Creating manifests and initializing your repository...
        </p>
      </div>

      {/* Ready State */}
      {stage === 'ready' && (
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Ready to Generate</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>✓ AI Name: <strong>{wizardData.aiName}</strong></p>
              <p>✓ Repository: <strong>{wizardData.repoName}</strong></p>
              <p>✓ Three priorities captured</p>
              <p>✓ Communication style set</p>
              <p>✓ Binding accepted</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">What Happens Next</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Generate 8 manifest files using Claude API (~2-3 minutes)</li>
              <li>Create private GitHub repository: <code className="text-blue-400">{wizardData.repoName}</code></li>
              <li>Write all manifests to repository</li>
              <li>Initialize your AI with complete context</li>
            </ol>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Generate Manifests & Create Repository
          </button>
        </div>
      )}

      {/* Generating State */}
      {stage === 'generating' && (
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
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
        </div>
      )}

      {/* Creating Repo State */}
      {stage === 'creating_repo' && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            Creating GitHub Repository
          </h3>
          <p className="text-gray-300 text-sm">
            Creating private repository: <code className="text-blue-400">{wizardData.repoName}</code>
          </p>
        </div>
      )}

      {/* Writing Files State */}
      {stage === 'writing_files' && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            Writing Manifests to Repository
          </h3>
          <p className="text-gray-300 text-sm">
            Writing {manifests.length} files...
          </p>
        </div>
      )}

      {/* Complete State */}
      {stage === 'complete' && (
        <div>
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-green-400 flex items-center gap-3">
              <span className="text-3xl">✓</span>
              Initialization Complete!
            </h3>
            
            <div className="space-y-3 text-gray-300">
              <p>
                <strong>{wizardData.aiName}</strong> has been successfully created and bound to you.
              </p>
              <p>
                Repository: <a 
                  href={repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {wizardData.repoName}
                </a>
              </p>
              <p>
                {manifests.length} manifests generated and committed.
              </p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">What's Next</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Your AI is ready to chat</li>
              <li>• All data is stored in your private GitHub repository</li>
              <li>• You can edit manifests anytime (data sovereignty)</li>
              <li>• Use activation phrases to switch modes</li>
            </ul>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Start Using {wizardData.aiName}
          </button>
        </div>
      )}

      {/* Error State */}
      {stage === 'error' && (
        <div>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">
              Generation Failed
            </h3>
            <p className="text-gray-300 mb-4">{error}</p>
            
            {manifests.length > 0 && (
              <div className="text-sm text-gray-400">
                <p>Generated {manifests.length} / 8 manifests before error.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition"
            >
              Start Over
            </button>
          </div>
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

## Repository Structure

\`\`\`
${wizardData.repoName}/
├── routing/
│   ├── routing_loader.json         # System architecture
│   ├── manifest_index.json         # Routing intelligence
│   └── core_identity_snapshot.json # Instant critical context
├── manifests/
│   ├── ${wizardData.creatorName.toLowerCase().replace(/\s+/g, '_')}_context.json
│   ├── memory_weights.json
│   └── operational_rules.json
├── modules/
│   └── identity/
│       ├── identity_core.json      # The Binding
│       └── personality_profile.json
└── README.md (this file)
\`\`\`

---

## Activation Phrases

- **Professional Mode:** "${wizardData.activationPhrases.professional}"
- **Casual Mode:** "${wizardData.activationPhrases.casual}"

---

**Built with Ancillary Protocol v2.0.0**
`;
}

export default Step13_Generation;
