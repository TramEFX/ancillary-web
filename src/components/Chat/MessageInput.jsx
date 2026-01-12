import React, { useState } from 'react';
import useThemeStore, { themes } from '../../store/themeStore';

function MessageInput({ onSend, isLoading }) {
  const { theme: themeName } = useThemeStore();
  const theme = themes[themeName];
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`border-t ${theme.colors.border.primary} ${theme.colors.bg.secondary}`}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isLoading}
            rows={1}
            className={`flex-1 px-4 py-3 ${theme.colors.bg.tertiary} border ${theme.colors.border.secondary} rounded-xl ${theme.colors.text.primary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              minHeight: '52px',
              maxHeight: '200px',
              resize: 'none',
              overflow: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = '52px';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            style={{ height: '52px' }}
            title="Send message (Enter)"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
        <div className={`mt-2 text-xs ${theme.colors.text.muted} text-center`}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
