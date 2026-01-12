import React, { useState } from 'react';
import useThemeStore, { themes } from '../../store/themeStore';

function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isCollapsed,
  onToggle,
}) {
  const { theme: themeName } = useThemeStore();
  const theme = themes[themeName];
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Filter conversations by search query
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => 
      conv.title?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Group filtered conversations by date
  const groupedConversations = React.useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    filteredConversations.forEach(conv => {
      const convDate = new Date(conv.id);
      
      if (convDate >= today) {
        groups.today.push(conv);
      } else if (convDate >= yesterday) {
        groups.yesterday.push(conv);
      } else if (convDate >= lastWeek) {
        groups.lastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const handleStartEdit = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title || 'Untitled conversation');
  };

  const handleSaveEdit = (conv) => {
    if (editingTitle.trim() && editingTitle !== conv.title) {
      onRenameConversation(conv.id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  if (isCollapsed) {
    return (
      <div className={`w-16 border-r ${theme.colors.border.primary} ${theme.colors.bg.primary} flex flex-col`}>
        <button
          onClick={onToggle}
          className={`p-4 ${theme.colors.hover} ${theme.colors.text.primary} transition`}
          title="Expand sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <button
          onClick={onNewConversation}
          className={`p-4 ${theme.colors.hover} ${theme.colors.text.primary} transition`}
          title="New conversation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-80 border-r ${theme.colors.border.primary} ${theme.colors.bg.primary} flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border.primary}`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggle}
            className={`p-2.5 ${theme.colors.bg.tertiary} ${theme.colors.text.primary} ${theme.colors.hover} rounded-lg transition border ${theme.colors.border.secondary}`}
            title="Collapse sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button
            onClick={onNewConversation}
            className={`flex items-center gap-2 px-4 py-2.5 ${theme.colors.accent.primary} text-white rounded-lg transition font-medium shadow-lg`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className={`w-full px-3 py-2.5 pl-10 ${theme.colors.bg.tertiary} border ${theme.colors.border.primary} rounded-lg text-sm ${theme.colors.text.primary} placeholder-gray-500 focus:outline-none focus:border-blue-500 transition`}
          />
          <svg 
            className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.colors.text.muted}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {/* Today */}
        {groupedConversations.today.length > 0 && (
          <div className="px-3 py-3">
            <h3 className={`text-xs font-semibold ${theme.colors.text.tertiary} uppercase tracking-wider mb-2 px-2`}>Today</h3>
            {groupedConversations.today.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                isEditing={editingId === conv.id}
                editingTitle={editingTitle}
                onEditingTitleChange={setEditingTitle}
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
                onStartEdit={(e) => handleStartEdit(conv, e)}
                onSaveEdit={() => handleSaveEdit(conv)}
                onCancelEdit={handleCancelEdit}
              />
            ))}
          </div>
        )}

        {/* Yesterday */}
        {groupedConversations.yesterday.length > 0 && (
          <div className="px-3 py-3">
            <h3 className={`text-xs font-semibold ${theme.colors.text.tertiary} uppercase tracking-wider mb-2 px-2`}>Yesterday</h3>
            {groupedConversations.yesterday.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                isEditing={editingId === conv.id}
                editingTitle={editingTitle}
                onEditingTitleChange={setEditingTitle}
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
                onStartEdit={(e) => handleStartEdit(conv, e)}
                onSaveEdit={() => handleSaveEdit(conv)}
                onCancelEdit={handleCancelEdit}
              />
            ))}
          </div>
        )}

        {/* Last Week */}
        {groupedConversations.lastWeek.length > 0 && (
          <div className="px-3 py-3">
            <h3 className={`text-xs font-semibold ${theme.colors.text.tertiary} uppercase tracking-wider mb-2 px-2`}>Last Week</h3>
            {groupedConversations.lastWeek.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                isEditing={editingId === conv.id}
                editingTitle={editingTitle}
                onEditingTitleChange={setEditingTitle}
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
                onStartEdit={(e) => handleStartEdit(conv, e)}
                onSaveEdit={() => handleSaveEdit(conv)}
                onCancelEdit={handleCancelEdit}
              />
            ))}
          </div>
        )}

        {/* Older */}
        {groupedConversations.older.length > 0 && (
          <div className="px-3 py-3">
            <h3 className={`text-xs font-semibold ${theme.colors.text.tertiary} uppercase tracking-wider mb-2 px-2`}>Older</h3>
            {groupedConversations.older.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                isEditing={editingId === conv.id}
                editingTitle={editingTitle}
                onEditingTitleChange={setEditingTitle}
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
                onStartEdit={(e) => handleStartEdit(conv, e)}
                onSaveEdit={() => handleSaveEdit(conv)}
                onCancelEdit={handleCancelEdit}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredConversations.length === 0 && !searchQuery && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No conversations yet.<br />Start a new chat to begin.
          </div>
        )}

        {/* No search results */}
        {filteredConversations.length === 0 && searchQuery && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No conversations found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({ 
  conversation, 
  isActive, 
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onClick, 
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) {
  const { theme: themeName } = useThemeStore();
  const theme = themes[themeName];
  const [showActions, setShowActions] = useState(false);

  if (isEditing) {
    return (
      <div className={`px-3 py-2.5 rounded-lg mb-1 ${theme.colors.bg.tertiary}`}>
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => onEditingTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSaveEdit();
            if (e.key === 'Escape') onCancelEdit();
          }}
          onBlur={onSaveEdit}
          autoFocus
          className={`w-full ${theme.colors.bg.secondary} border ${theme.colors.border.secondary} ${theme.colors.text.primary} px-2.5 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        group relative px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-all ${theme.colors.text.secondary}
        ${isActive ? theme.colors.active + ' shadow-sm ' + theme.colors.text.primary : theme.colors.hover}
      `}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate flex-1">
          {conversation.title || 'Untitled conversation'}
        </span>
        
        {showActions && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={onStartEdit}
              className={`p-1.5 ${theme.colors.bg.secondary} ${theme.colors.hover} rounded transition`}
              title="Rename"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this conversation?')) {
                  onDelete();
                }
              }}
              className="p-1.5 hover:bg-red-600 rounded transition"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationSidebar;
