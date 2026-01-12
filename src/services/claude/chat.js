// Use Cloudflare Worker proxy instead of direct Claude API
const CLAUDE_API_URL = 'https://ancillary-worker.ancillaryproxy.workers.dev';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

/**
 * Sends a message to Claude API via Cloudflare Worker proxy
 * @param {string} message - User message
 * @param {Array} context - Array of previous messages and loaded manifests
 * @param {string} apiKey - Anthropic API key
 * @param {object} options - Additional options (system prompt, temperature, etc.)
 * @returns {Promise<object>} Claude's response
 */
export async function sendMessage(message, context = [], apiKey, options = {}) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey, // User's API key sent to worker
      },
      body: JSON.stringify({
        model: options.model || CLAUDE_MODEL,
        max_tokens: options.max_tokens || 4096,
        system: options.system || undefined,
        messages: [
          ...context,
          { role: 'user', content: message }
        ],
        temperature: options.temperature || 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Sends a message with streaming response via Cloudflare Worker
 * @param {string} message - User message
 * @param {Array} context - Array of previous messages
 * @param {string} apiKey - Anthropic API key
 * @param {function} onChunk - Callback for each chunk of text
 * @param {object} options - Additional options
 * @returns {Promise<void>}
 */
export async function sendMessageStream(message, context, apiKey, onChunk, options = {}) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: options.model || CLAUDE_MODEL,
        max_tokens: options.max_tokens || 4096,
        system: options.system || undefined,
        messages: [
          ...context,
          { role: 'user', content: message }
        ],
        stream: true,
        temperature: options.temperature || 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API request failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || '';
              if (text) onChunk(text);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error);
    throw error;
  }
}

/**
 * Validates a Claude API key by sending a minimal test request via worker
 * @param {string} apiKey - Anthropic API key to validate
 * @returns {Promise<{valid: boolean, error?: string}>} Validation result with error details
 */
export async function validateApiKey(apiKey) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 10,
        messages: [
          { role: 'user', content: 'Hi' }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API validation error:', error);
      
      // Check for authentication errors specifically
      if (response.status === 401 || response.status === 403) {
        return { valid: false, error: 'Invalid API key' };
      }
      
      // Other errors (rate limit, etc.)
      return { valid: false, error: error.error?.message || 'API error' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Claude API validation exception:', error);
    return { valid: false, error: error.message };
  }
}
