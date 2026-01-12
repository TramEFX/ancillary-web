import { useState } from 'react';
import useAncillaryStore from './store/useAncillaryStore';
import Auth from './pages/Auth';
import ChatContainer from './components/Chat';
import MainChat from './components/MainChat';

function App() {
  const { isAuthenticated, logout, isInitialized, aiName, repoName } = useAncillaryStore();

  const handleInitializationComplete = () => {
    // Initialization complete, reload to show main app
    window.location.reload();
  };

  // Not authenticated - show auth page
  if (!isAuthenticated()) {
    return <Auth onSuccess={() => {}} />;
  }

  // Authenticated but not initialized - show chat initialization
  if (!isInitialized) {
    return (
      <div className="h-screen">
        <ChatContainer onInitializationComplete={handleInitializationComplete} />
      </div>
    );
  }

  // Authenticated and initialized - show main chat
  return (
    <div className="h-screen">
      <MainChat />
    </div>
  );
}

export default App;
