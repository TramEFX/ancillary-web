import React from 'react';
import ReactMarkdown from 'react-markdown';
import useThemeStore, { themes } from '../../store/themeStore';

function MessageList({ messages, isLoading }) {
  const { theme: themeName } = useThemeStore();
  const theme = themes[themeName];
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                message.role === 'user'
                  ? `${theme.colors.message.user} text-white`
                  : `${theme.colors.message.assistant} ${theme.colors.text.primary}`
              }`}
            >
              {message.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="mb-4 last:mb-0 space-y-2 list-disc list-inside">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-4 last:mb-0 space-y-2 list-decimal list-inside">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="px-1.5 py-0.5 bg-gray-700 rounded text-blue-300 text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block p-4 bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono my-3">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => <pre className="my-3">{children}</pre>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-6 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-600 pl-4 italic my-3 text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`${theme.colors.message.assistant} ${theme.colors.text.primary} rounded-2xl px-5 py-3.5`}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`w-2 h-2 ${theme.colors.text.muted.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 ${theme.colors.text.muted.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 ${theme.colors.text.muted.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className={`text-sm ${theme.colors.text.muted}`}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageList;
