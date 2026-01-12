import { useState, useCallback, useRef, useEffect } from 'react';
import { sendMessage } from '../../services/claude';

/**
 * Chat state management hook
 * @param {string} apiKey - Claude API key
 * @param {string} systemPrompt - System prompt to use
 * @param {function} onInitializationComplete - Callback when initialization completes (optional)
 * @param {boolean} autoStart - Whether to send initial empty message (default: false for normal chat)
 */
export function useChat(apiKey, systemPrompt = '', onInitializationComplete = null, autoStart = false) {
  const [messages, setMessagesState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializationData, setInitializationData] = useState(null);
  
  const conversationHistory = useRef([]);
  const hasStarted = useRef(false);

  // Expose setMessages for external control (loading conversation history)
  const setMessages = useCallback((newMessages) => {
    setMessagesState(newMessages);
    conversationHistory.current = newMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));
  }, []);

  // Add message to chat
  const addMessage = useCallback((role, content) => {
    const message = {
      id: Date.now() + Math.random(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessagesState(prev => [...prev, message]);
    
    // Track in conversation history for API
    conversationHistory.current.push({
      role,
      content,
    });
    
    return message;
  }, []);

  // Send user message and get response
  const sendUserMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() && conversationHistory.current.length > 0) return; // Skip empty messages after first
    
    setError(null);
    setIsLoading(true);

    try {
      // Add user message (if not empty)
      if (userMessage.trim()) {
        addMessage('user', userMessage);
      }

      // Build messages array for API
      const messages = conversationHistory.current;

      // Send to Claude
      const response = await sendMessage(
        systemPrompt,
        messages,
        apiKey,
        {
          max_tokens: 4096,
          temperature: 0.7,
        }
      );

      // Extract response text
      const assistantMessage = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      // Add assistant message
      addMessage('assistant', assistantMessage);

      // Check if initialization is complete (look for JSON in response)
      const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          if (data.initialization_complete) {
            setInitializationData(data.extracted_data);
            if (onInitializationComplete) {
              onInitializationComplete(data.extracted_data);
            }
          }
        } catch (e) {
          // Not valid initialization JSON, ignore
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [apiKey, systemPrompt, addMessage, onInitializationComplete]);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessagesState([]);
    conversationHistory.current = [];
    setInitializationData(null);
    setError(null);
  }, []);

  // Auto-start conversation (only for initialization mode)
  useEffect(() => {
    if (autoStart && systemPrompt && messages.length === 0 && !hasStarted.current) {
      hasStarted.current = true;
      // Send empty message to trigger AI's opening
      sendUserMessage('');
    }
  }, [autoStart, systemPrompt, messages.length, sendUserMessage]);

  return {
    messages,
    isLoading,
    error,
    initializationData,
    sendMessage: sendUserMessage,
    clearChat,
    setMessages, // Expose for loading conversation history
  };
}

export default useChat;
