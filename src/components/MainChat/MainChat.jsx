import React, { useState, useEffect, useRef, useCallback } from 'react';
import useAncillaryStore from '../../store/useAncillaryStore';
import useThemeStore, { themes } from '../../store/themeStore';
import { useChat } from '../Chat/useChat';
import {
  loadInitialContext,
  buildSystemPrompt,
  buildFallbackPrompt,
  loadManifests,
  searchManifests,
  needsAdditionalContext,
  createMemoryManifest,
} from '../../services/manifest';
import {
  listConversations,
  loadConversation,
  saveConversation,
  createConversation,
  deleteConversation,
  renameConversation,
  generateTitleFromMessage,
  getCachedConversationList,
  cacheConversationList,
} from '../../services/conversations';
import { loadUserState, updateLastConversation } from '../../services/conversations/userState';
import ConversationSidebar from '../Sidebar';
import MessageList from '../Chat/MessageList';
import MessageInput from '../Chat/MessageInput';
import NavigationHeader from '../Navigation/NavigationHeader';

function MainChat() {
  const { githubToken, apiKey, aiName, repoOwner, repoName } = useAncillaryStore();
  const { theme: themeName } = useThemeStore();
  const theme = themes[themeName];
  
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [contextError, setContextError] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [context, setContext] = useState(null);
  const [loadedManifestPaths, setLoadedManifestPaths] = useState(new Set());
  
  // Conversation management
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  
  // Memory creation state
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(false);
  const [pendingMemory, setPendingMemory] = useState(null);

  const conversationRef = useRef(null);

  // Load manifests and build system prompt
  useEffect(() => {
    async function loadContext() {
      try {
        setIsLoadingContext(true);
        setContextError(null);

        console.log('Loading initial context...');

        // Load routing layer + high-priority manifests
        const loadedContext = await loadInitialContext(githubToken, repoOwner, repoName);
        
        console.log('Context loaded:', loadedContext);
        setContext(loadedContext);

        // Track loaded manifest paths
        const paths = new Set(loadedContext.manifests.map(m => 
          m.manifest_type || m.path || ''
        ));
        setLoadedManifestPaths(paths);

        // Build system prompt from loaded manifests
        const prompt = buildSystemPrompt(loadedContext.routingLayer, loadedContext.manifests);
        
        // Add memory creation instructions
        const enhancedPrompt = prompt + `

## MEMORY CREATION

You can create permanent memories during conversation. When something significant happens:
- A decision is made
- Important information is shared
- A breakthrough or insight occurs
- A milestone is reached

You can say: "This feels important. Want me to remember this permanently?"

If user agrees, output a memory creation request in this format:

\`\`\`memory
{
  "create_memory": true,
  "event_name": "[Brief descriptive name]",
  "weight": [0.9996 for important, 0.9998 for very important],
  "context": {
    "what_happened": "[What occurred]",
    "why_significant": "[Why it matters to priorities]",
    "what_changed": "[What's different now]"
  },
  "implications": {
    "for_priority_1": "[Impact on priority 1]",
    "for_priority_2": "[Impact on priority 2]",
    "for_priority_3": "[Impact on priority 3]"
  }
}
\`\`\`

Only create memories for genuinely significant moments. Don't over-use this.
`;

        setSystemPrompt(enhancedPrompt);
        setIsLoadingContext(false);
      } catch (error) {
        console.error('Error loading context:', error);
        setContextError(error.message);
        
        // Use fallback prompt
        const fallback = buildFallbackPrompt(aiName, 'you');
        setSystemPrompt(fallback);
        setIsLoadingContext(false);
      }
    }

    if (githubToken && repoOwner && repoName) {
      loadContext();
    }
  }, [githubToken, repoOwner, repoName, aiName]);

  // Load conversations on mount
  useEffect(() => {
    async function loadConversationsAndState() {
      if (!githubToken || !repoOwner || !repoName) return;

      try {
        setIsLoadingConversations(true);

        // Try cache first
        const cached = getCachedConversationList();
        if (cached) {
          console.log('Using cached conversation list');
          setConversations(cached);
        }

        // Load from GitHub
        const convos = await listConversations(githubToken, repoOwner, repoName);
        setConversations(convos);
        cacheConversationList(convos);

        // Load user state to get last conversation
        const userState = await loadUserState(githubToken, repoOwner, repoName);
        
        let conversationToLoad = null;

        if (userState.lastConversationId && convos.find(c => c.id === userState.lastConversationId)) {
          // Load last conversation
          conversationToLoad = await loadConversation(
            githubToken,
            repoOwner,
            repoName,
            userState.lastConversationId
          );
          console.log('Loaded last conversation:', userState.lastConversationId);
        } else if (convos.length > 0) {
          // Load most recent conversation
          conversationToLoad = await loadConversation(
            githubToken,
            repoOwner,
            repoName,
            convos[0].id
          );
          console.log('Loaded most recent conversation');
        } else {
          // Create new conversation
          conversationToLoad = await createConversation(
            githubToken,
            repoOwner,
            repoName,
            'New Conversation'
          );
          console.log('Created new conversation');
          
          // Reload conversation list
          const updatedConvos = await listConversations(githubToken, repoOwner, repoName);
          setConversations(updatedConvos);
          cacheConversationList(updatedConvos);
        }

        setCurrentConversation(conversationToLoad);
        conversationRef.current = conversationToLoad;
        
        // Update user state
        await updateLastConversation(githubToken, repoOwner, repoName, conversationToLoad.id);

        setIsLoadingConversations(false);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setIsLoadingConversations(false);
      }
    }

    loadConversationsAndState();
  }, [githubToken, repoOwner, repoName]);

  // Initialize chat with system prompt and current conversation
  const { messages, isLoading, error, sendMessage: chatSendMessage, clearChat, setMessages } = useChat(
    apiKey,
    systemPrompt,
    null,
    false
  );

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      console.log('Loading messages for conversation:', currentConversation.id);
      setMessages(currentConversation.messages || []);
    }
  }, [currentConversation?.id]);

  // Save conversation after messages change
  useEffect(() => {
    if (!currentConversation || messages.length === 0) return;
    
    // Update current conversation with messages
    const updatedConversation = {
      ...currentConversation,
      messages,
      messageCount: messages.length,
      updated: new Date().toISOString(),
    };
    
    conversationRef.current = updatedConversation;

    // Debounced save (wait 2 seconds after last message)
    const timer = setTimeout(async () => {
      console.log('Auto-saving conversation...');
      try {
        await saveConversation(githubToken, repoOwner, repoName, updatedConversation);
        
        // Refresh conversation list if title might have changed
        // (to update sidebar with new filename)
        const convos = await listConversations(githubToken, repoOwner, repoName);
        setConversations(convos);
        cacheConversationList(convos);
      } catch (err) {
        console.error('Failed to save conversation:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [messages, currentConversation?.id, githubToken, repoOwner, repoName]);

  // Handle semantic loading before sending message
  const handleSemanticLoading = useCallback(async (userMessage) => {
    if (!context) return;

    try {
      if (needsAdditionalContext(userMessage, Array.from(loadedManifestPaths))) {
        console.log('Semantic loading triggered for:', userMessage);
        
        const results = searchManifests(context.routingLayer.manifestIndex, userMessage);
        
        if (results.length > 0) {
          const toLoad = results
            .filter(m => !loadedManifestPaths.has(m.path))
            .slice(0, 3);
          
          if (toLoad.length > 0) {
            console.log('Loading additional manifests:', toLoad.map(m => m.path));
            
            const newManifests = await loadManifests(
              githubToken,
              repoOwner,
              repoName,
              toLoad.map(m => m.path)
            );
            
            const updatedManifests = [...context.manifests, ...newManifests];
            setContext({
              ...context,
              manifests: updatedManifests,
            });
            
            const newPrompt = buildSystemPrompt(context.routingLayer, updatedManifests);
            setSystemPrompt(newPrompt);
            
            toLoad.forEach(m => loadedManifestPaths.add(m.path));
            setLoadedManifestPaths(new Set(loadedManifestPaths));
            
            console.log('Loaded additional context');
          }
        }
      }
    } catch (error) {
      console.error('Error in semantic loading:', error);
    }
  }, [context, loadedManifestPaths, githubToken, repoOwner, repoName]);

  // Detect memory creation in AI response
  const detectMemoryCreation = useCallback((response) => {
    const memoryMatch = response.match(/```memory\s*([\s\S]*?)\s*```/);
    if (memoryMatch) {
      try {
        const memoryData = JSON.parse(memoryMatch[1]);
        if (memoryData.create_memory) {
          return memoryData;
        }
      } catch (e) {
        console.error('Error parsing memory creation:', e);
      }
    }
    return null;
  }, []);

  // Create memory
  const handleCreateMemory = async (memoryData) => {
    try {
      console.log('Creating memory:', memoryData);
      
      await createMemoryManifest(
        githubToken,
        repoOwner,
        repoName,
        memoryData
      );
      
      console.log('Memory created successfully');
      setShowMemoryPrompt(false);
      setPendingMemory(null);
      
      return true;
    } catch (error) {
      console.error('Error creating memory:', error);
      return false;
    }
  };

  // Wrapped send message with semantic loading
  const handleSendMessage = useCallback(async (message) => {
    await handleSemanticLoading(message);
    await chatSendMessage(message);
  }, [handleSemanticLoading, chatSendMessage]);

  // Watch for memory creation in messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant') {
      const memoryData = detectMemoryCreation(lastMessage.content);
      if (memoryData && !showMemoryPrompt) {
        setPendingMemory(memoryData);
        setShowMemoryPrompt(true);
      }
    }
  }, [messages.length]);

  // Conversation management
  const handleSelectConversation = async (conversationId) => {
    if (conversationId === currentConversation?.id) return;

    try {
      // Save current conversation first
      if (conversationRef.current) {
        await saveConversation(githubToken, repoOwner, repoName, conversationRef.current);
      }

      // Load selected conversation
      const conv = await loadConversation(githubToken, repoOwner, repoName, conversationId);
      setCurrentConversation(conv);
      conversationRef.current = conv;
      
      // Update user state
      await updateLastConversation(githubToken, repoOwner, repoName, conversationId);
    } catch (error) {
      console.error('Error switching conversation:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      // Save current conversation first
      if (conversationRef.current) {
        await saveConversation(githubToken, repoOwner, repoName, conversationRef.current);
      }

      // Create new conversation
      const newConv = await createConversation(githubToken, repoOwner, repoName, 'New Conversation');
      
      // Reload conversation list
      const convos = await listConversations(githubToken, repoOwner, repoName);
      setConversations(convos);
      cacheConversationList(convos);
      
      // Set as current
      setCurrentConversation(newConv);
      conversationRef.current = newConv;
      
      // Update user state
      await updateLastConversation(githubToken, repoOwner, repoName, newConv.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(githubToken, repoOwner, repoName, conversationId);
      
      // Reload conversation list
      const convos = await listConversations(githubToken, repoOwner, repoName);
      setConversations(convos);
      cacheConversationList(convos);
      
      // If we deleted current conversation, load another
      if (conversationId === currentConversation?.id) {
        if (convos.length > 0) {
          const conv = await loadConversation(githubToken, repoOwner, repoName, convos[0].id);
          setCurrentConversation(conv);
          conversationRef.current = conv;
          await updateLastConversation(githubToken, repoOwner, repoName, conv.id);
        } else {
          // No conversations left, create new one
          await handleNewConversation();
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleRenameConversation = async (conversationId, newTitle) => {
    try {
      await renameConversation(githubToken, repoOwner, repoName, conversationId, newTitle);
      
      // Reload conversation list
      const convos = await listConversations(githubToken, repoOwner, repoName);
      setConversations(convos);
      cacheConversationList(convos);
      
      // Update current conversation if it's the one we renamed
      if (conversationId === currentConversation?.id) {
        const updatedConv = { ...currentConversation, title: newTitle };
        setCurrentConversation(updatedConv);
        conversationRef.current = updatedConv;
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  // Auto-generate title from first user message
  useEffect(() => {
    if (!currentConversation || messages.length === 0) return;
    
    // Check if this is the first user message and title is still default
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage && 
        (currentConversation.title === 'New Conversation' || !currentConversation.title)) {
      const autoTitle = generateTitleFromMessage(firstUserMessage.content);
      
      if (autoTitle !== 'New Conversation' && autoTitle !== currentConversation.title) {
        console.log('Auto-generating title:', autoTitle);
        
        // Update title - save will handle the rest (no file rename needed)
        const updatedConv = { ...currentConversation, title: autoTitle };
        setCurrentConversation(updatedConv);
        conversationRef.current = updatedConv;
        
        // The auto-save will save with updated title (same filename, just JSON change)
      }
    }
  }, [messages.length, currentConversation?.id]);

  // Show loading state
  if (isLoadingContext || isLoadingConversations) {
    return (
      <div className={`flex flex-col h-full items-center justify-center ${theme.colors.bg.secondary}`}>
        <div className="max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className={`text-xl font-semibold mb-2 ${theme.colors.text.primary}`}>Loading {aiName}...</h2>
          <p className={`text-sm ${theme.colors.text.tertiary}`}>
            {isLoadingContext && 'Reading manifests from repository...'}
            {isLoadingConversations && 'Loading conversations...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (contextError && !systemPrompt) {
    return (
      <div className={`flex flex-col h-full items-center justify-center ${theme.colors.bg.secondary} p-8`}>
        <div className="max-w-2xl w-full">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-400">
              Failed to Load Context
            </h2>
            <p className={`mb-4 ${theme.colors.text.secondary}`}>{contextError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface
  return (
    <div className={`flex flex-col h-full ${theme.colors.bg.secondary}`}>
      {/* Navigation Header */}
      <NavigationHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Memory Creation Prompt */}
        {showMemoryPrompt && pendingMemory && (
          <div className="bg-blue-950/30 border-b border-blue-900/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-400">Create Memory?</h3>
                <p className={`text-sm ${theme.colors.text.secondary} mt-1`}>
                  {pendingMemory.event_name}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleCreateMemory(pendingMemory);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition text-white"
                >
                  Yes, Remember This
                </button>
                <button
                  onClick={() => {
                    setShowMemoryPrompt(false);
                    setPendingMemory(null);
                  }}
                  className={`px-4 py-2 ${theme.colors.bg.tertiary} ${theme.colors.hover} rounded-lg text-sm font-medium transition ${theme.colors.text.primary}`}
                >
                  No Thanks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input */}
        <MessageInput 
          onSend={handleSendMessage} 
          isLoading={isLoading}
        />

        {/* Error display */}
        {error && (
          <div className={`px-4 py-3 bg-red-900/20 border-t border-red-500 text-red-300 text-sm ${theme.colors.text.primary}`}>
            Error: {error}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default MainChat;
