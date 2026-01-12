import React, { useState } from 'react';
import useAncillaryStore from '../../store/useAncillaryStore';
import useThemeStore, { themes } from '../../store/themeStore';
import SetupGuide from '../SetupGuide/SetupGuide';

function NavigationHeader() {
  const { logout, repoOwner, repoName, aiName } = useAncillaryStore();
  const { theme: themeName, setTheme } = useThemeStore();
  const theme = themes[themeName];
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Log out? You\'ll need to re-enter your credentials.')) {
      logout();
      window.location.reload();
    }
  };

  return (
    <>
      <div className={`${theme.colors.bg.primary} border-b ${theme.colors.border.primary} px-6 py-3`}>
        <div className="flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ancillary
            </h1>
            <div className="text-sm">
              <span className={theme.colors.text.secondary}>{aiName || 'AI'}</span>
              {repoOwner && (
                <span className={`ml-2 ${theme.colors.text.muted}`}>
                  • {repoOwner}/{repoName}
                </span>
              )}
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-3">
            {/* Setup Guide */}
            <button
              onClick={() => setShowSetupGuide(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm ${theme.colors.text.secondary} hover:${theme.colors.text.primary} ${theme.colors.hover} rounded-lg transition`}
              title="Setup Guide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="hidden sm:inline">Setup Guide</span>
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-3 py-2 text-sm ${theme.colors.text.secondary} hover:${theme.colors.text.primary} ${theme.colors.hover} rounded-lg transition`}
                title="Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Settings</span>
              </button>

              {showSettings && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSettings(false)}
                  />

                  {/* Dropdown */}
                  <div className={`absolute right-0 mt-2 w-64 ${theme.colors.bg.secondary} border ${theme.colors.border.primary} rounded-lg shadow-xl z-20`}>
                    <div className="p-2">
                      {/* View Tokens */}
                      <button
                        onClick={() => {
                          const ghToken = localStorage.getItem('ancillary_github_token');
                          const apiKey = localStorage.getItem('ancillary_api_key');
                          alert(
                            `GitHub Token: ${ghToken ? ghToken.substring(0, 20) + '...' : 'Not found'}\n\n` +
                            `Claude API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : 'Not found'}`
                          );
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${theme.colors.text.secondary} ${theme.colors.hover} rounded-lg transition text-left`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Credentials
                      </button>

                      {/* Theme Selector */}
                      <div className="px-3 py-2">
                        <p className={`text-xs ${theme.colors.text.muted} uppercase tracking-wide mb-2`}>Theme</p>
                        <div className="space-y-1">
                          {Object.entries(themes).map(([key, themeData]) => (
                            <button
                              key={key}
                              onClick={() => setTheme(key)}
                              className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded transition text-left ${
                                themeName === key ? 'bg-blue-600 text-white' : `${theme.colors.text.secondary} ${theme.colors.hover}`
                              }`}
                            >
                              <span>{themeData.name}</span>
                              {themeName === key && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* GitHub Repo */}
                      {repoOwner && repoName && (
                        <a
                          href={`https://github.com/${repoOwner}/${repoName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${theme.colors.text.secondary} ${theme.colors.hover} rounded-lg transition`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View GitHub Repo
                        </a>
                      )}

                      <div className={`my-1 border-t ${theme.colors.border.primary}`} />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <SetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </>
  );
}

export default NavigationHeader;
