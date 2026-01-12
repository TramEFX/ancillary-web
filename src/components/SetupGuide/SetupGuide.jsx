import React, { useState } from 'react';

function SetupGuide({ onClose }) {
  const [activeTab, setActiveTab] = useState('github');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div>
            <h2 className="text-2xl font-bold text-white">Setup Guide</h2>
            <p className="text-sm text-gray-400 mt-1">Get started with Ancillary in 3 steps</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-800 flex gap-2 bg-gray-950">
          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'github'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            1. GitHub Token
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'api'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            2. LLM API Key
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'connect'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            3. Connect
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'github' && <GitHubTokenGuide />}
          {activeTab === 'api' && <APIKeyGuide />}
          {activeTab === 'connect' && <ConnectGuide />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-950 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Need help? <a href="https://github.com/yourusername/ancillary" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">View Documentation</a>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

function GitHubTokenGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Why GitHub?</h3>
        <p className="text-gray-300 leading-relaxed">
          Ancillary stores your conversations and AI memory in <strong>your own GitHub repository</strong>. 
          This means you own your data, can switch AI providers anytime, and have full control over your information.
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Create a GitHub Account (if needed)</h4>
            <ol className="space-y-2 text-sm text-gray-300 ml-4 list-decimal">
              <li>Go to <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">github.com/signup</a></li>
              <li>Enter your email and create a password</li>
              <li>Choose a username</li>
              <li>Verify your account via email</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Generate a Personal Access Token</h4>
            <ol className="space-y-2 text-sm text-gray-300 ml-4 list-decimal">
              <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">github.com/settings/tokens</a></li>
              <li>Click <strong>"Generate new token"</strong> → <strong>"Generate new token (classic)"</strong></li>
              <li>
                Give it a name like <code className="px-1.5 py-0.5 bg-gray-700 rounded text-blue-300">Ancillary</code>
              </li>
              <li>Under <strong>Scopes</strong>, check the <code className="px-1.5 py-0.5 bg-gray-700 rounded text-green-300">repo</code> box (full repository access)</li>
              <li>Click <strong>"Generate token"</strong> at the bottom</li>
              <li className="text-yellow-400 font-medium">
                ⚠️ <strong>Important:</strong> Copy your token immediately! You won't be able to see it again.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-300">
            <strong className="text-blue-400">Your token will look like:</strong>
            <code className="block mt-2 px-3 py-2 bg-gray-900 rounded text-green-300 font-mono text-xs">
              ghp_1234567890abcdefghijklmnopqrstuvwxyz
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIKeyGuide() {
  const [selectedProvider, setSelectedProvider] = useState('claude');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your AI Provider</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          Ancillary works with multiple AI providers. Choose the one you prefer:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setSelectedProvider('claude')}
            className={`p-4 border-2 rounded-lg transition ${
              selectedProvider === 'claude'
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="font-semibold">Anthropic Claude</div>
            <div className="text-xs text-gray-400 mt-1">Recommended</div>
          </button>

          <button
            onClick={() => setSelectedProvider('grok')}
            className={`p-4 border-2 rounded-lg transition ${
              selectedProvider === 'grok'
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="font-semibold">xAI Grok</div>
            <div className="text-xs text-gray-400 mt-1">Grok 4</div>
          </button>

          <button
            onClick={() => setSelectedProvider('openai')}
            className={`p-4 border-2 rounded-lg transition ${
              selectedProvider === 'openai'
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="font-semibold">OpenAI GPT</div>
            <div className="text-xs text-gray-400 mt-1">GPT-5, GPT-4o</div>
          </button>
        </div>
      </div>

      {selectedProvider === 'claude' && <ClaudeAPIGuide />}
      {selectedProvider === 'grok' && <GrokAPIGuide />}
      {selectedProvider === 'openai' && <OpenAIAPIGuide />}
    </div>
  );
}

function ClaudeAPIGuide() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
          1
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Get Your Claude API Key</h4>
          <ol className="space-y-2 text-sm text-gray-300 ml-4 list-decimal">
            <li>Go to <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">console.anthropic.com</a></li>
            <li>Sign up or log in to your Anthropic account</li>
            <li>Navigate to <strong>Settings</strong> → <strong>API Keys</strong></li>
            <li>Click <strong>"Create Key"</strong></li>
            <li>Give it a name and copy the key</li>
          </ol>

          <div className="mt-4 bg-blue-950/30 border border-blue-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-blue-400">Your API key will look like:</strong>
                <code className="block mt-2 px-2 py-1 bg-gray-900 rounded text-green-300 font-mono">
                  sk-ant-1234567890abcdefghijklmnopqrstuvwxyz
                </code>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-950/30 border border-yellow-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-yellow-400">Note:</strong> Claude API is paid. You'll need to add billing info and will be charged based on usage. New accounts usually get $5 credit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrokAPIGuide() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
          1
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Get Your Grok API Key</h4>
          <ol className="space-y-2 text-sm text-gray-300 ml-4 list-decimal">
            <li>Go to <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">console.x.ai</a></li>
            <li>Sign up or log in to your xAI account</li>
            <li>Navigate to <strong>API Keys</strong></li>
            <li>Click <strong>"Create API Key"</strong></li>
            <li>Give it a name and copy the key</li>
          </ol>

          <div className="mt-4 bg-blue-950/30 border border-blue-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-blue-400">Your API key will look like:</strong>
                <code className="block mt-2 px-2 py-1 bg-gray-900 rounded text-green-300 font-mono">
                  xai-1234567890abcdefghijklmnopqrstuvwxyz
                </code>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-950/30 border border-yellow-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-yellow-400">Note:</strong> Grok API is paid. You'll need to add billing info and will be charged based on usage. Check xAI's pricing page for current rates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenAIAPIGuide() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
          1
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Get Your OpenAI API Key</h4>
          <ol className="space-y-2 text-sm text-gray-300 ml-4 list-decimal">
            <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">platform.openai.com/api-keys</a></li>
            <li>Sign up or log in to your OpenAI account</li>
            <li>Click <strong>"Create new secret key"</strong></li>
            <li>Give it a name and copy the key</li>
          </ol>

          <div className="mt-4 bg-blue-950/30 border border-blue-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-blue-400">Your API key will look like:</strong>
                <code className="block mt-2 px-2 py-1 bg-gray-900 rounded text-green-300 font-mono">
                  sk-proj-1234567890abcdefghijklmnopqrstuvwxyz
                </code>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-950/30 border border-yellow-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-gray-300">
                <strong className="text-yellow-400">Note:</strong> OpenAI API is paid. You'll need to add billing info and will be charged based on usage. New accounts may receive free credits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">You're Almost Ready!</h3>
        <p className="text-gray-300 leading-relaxed">
          Now that you have your GitHub token and API key, let's connect everything.
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Enter Your Credentials</h4>
            <p className="text-sm text-gray-300">
              Close this guide and paste your tokens into the connection form:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-400 ml-4 list-disc">
              <li>GitHub Personal Access Token (starts with <code className="text-green-300">ghp_</code>)</li>
              <li>LLM API Key:
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>Claude: starts with <code className="text-green-300">sk-ant-</code></li>
                  <li>Grok: starts with <code className="text-green-300">xai-</code></li>
                  <li>OpenAI: starts with <code className="text-green-300">sk-proj-</code></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">First Launch</h4>
            <p className="text-sm text-gray-300">
              On first launch, Ancillary will:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-400 ml-4 list-disc">
              <li>Create a private repository in your GitHub account</li>
              <li>Set up the folder structure for your AI memory</li>
              <li>Load initial configuration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-400 mb-1">Security Note</h4>
            <p className="text-sm text-gray-300">
              Your credentials are stored locally in your browser and never sent to our servers. 
              They're only used to connect directly to GitHub and your chosen AI provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupGuide;
