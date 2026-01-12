import { useState } from 'react';
import useAncillaryStore from '../store/useAncillaryStore';
import { getAuthenticatedUser, validateToken } from '../services/github';
import { validateApiKey } from '../services/claude';
import SetupGuide from '../components/SetupGuide/SetupGuide';

function Auth({ onSuccess }) {
  const { setGithubToken, setApiKey, setRepoInfo } = useAncillaryStore();
  
  const [githubToken, setGithubTokenInput] = useState('');
  const [claudeApiKey, setClaudeApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('input'); // 'input' | 'validating' | 'success'
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleConnect = async () => {
    setError(null);
    setIsValidating(true);
    setStep('validating');

    try {
      // Step 1: Validate GitHub token
      console.log('Validating GitHub token...');
      const githubValid = await validateToken(githubToken);
      if (!githubValid) {
        throw new Error('Invalid GitHub token. Please check and try again.');
      }

      // Step 2: Get GitHub user info
      const user = await getAuthenticatedUser(githubToken);
      console.log('GitHub user validated:', user.login);

      // Step 3: Validate Claude API key
      console.log('Validating Claude API key...');
      const claudeValidation = await validateApiKey(claudeApiKey);
      console.log('Claude validation result:', claudeValidation);
      
      if (!claudeValidation.valid) {
        throw new Error(`Claude API error: ${claudeValidation.error || 'Invalid API key'}`);
      }

      // Step 4: Store credentials
      setGithubToken(githubToken);
      setApiKey(claudeApiKey);
      setRepoInfo(user.login, ''); // Store username, repo name will be set later

      // Success!
      console.log('Authentication successful!');
      setStep('success');
      
      // Call success callback after brief delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
      setStep('input');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ancillary</h1>
          <p className="text-gray-400 text-lg">Your AI, Your Data, Your Control</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
          {step === 'input' && (
            <>
              <div className="space-y-4 mb-6">
                {/* GitHub Token */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-200">
                    GitHub Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubTokenInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Create at: <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">github.com/settings/tokens</a>
                    <br />
                    Required scope: <code className="px-1 py-0.5 bg-gray-800 rounded text-green-400">repo</code>
                  </p>
                </div>

                {/* Claude API Key */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-200">
                    Claude API Key
                  </label>
                  <input
                    type="password"
                    value={claudeApiKey}
                    onChange={(e) => setClaudeApiKeyInput(e.target.value)}
                    placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Get yours at: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">console.anthropic.com</a>
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-950/50 border border-red-900/50 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-400 mb-1">Authentication Failed</p>
                      <p className="text-gray-300">{error}</p>
                      <p className="text-xs mt-2 text-gray-400">Check browser console for details</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={!githubToken || !claudeApiKey || isValidating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3.5 rounded-lg font-semibold transition shadow-lg hover:shadow-blue-500/25"
              >
                {isValidating ? 'Validating...' : 'Connect'}
              </button>

              <div className="mt-4 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg text-xs">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-300">
                    Your credentials are stored locally in your browser and never sent to our servers.
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 'validating' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg">Validating credentials...</p>
              <p className="text-sm text-gray-400 mt-2">Testing GitHub and Claude API access</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-block mb-4">
                <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-green-400">Connected!</p>
              <p className="text-sm text-gray-400 mt-2">Credentials validated successfully</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setShowSetupGuide(true)}
            className="text-blue-400 hover:text-blue-300 underline text-sm font-medium"
          >
            📖 Need help? View Setup Guide
          </button>
        </div>
      </div>

      {showSetupGuide && (
        <SetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </div>
  );
}

export default Auth;
