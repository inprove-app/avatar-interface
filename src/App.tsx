import React, { useState, useEffect } from 'react';
import './App.css';
import TestEmbeddedChat from './TestEmbeddedChat';
import SimpleTest from './SimpleTest';
import { ChatComponent } from './ChatComponent';
import { Message as ChatMessage } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [showEmbeddedTest, setShowEmbeddedTest] = useState(false);
  const [showSimpleTest, setShowSimpleTest] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [responseType, setResponseType] = useState<'default' | 'text' | 'audio' | 'video'>('default');
  // Get user ID from URL parameter or generate a new one
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || 'web_user_' + Math.random().toString(36).substr(2, 9);
  };

  const [userId, setUserId] = useState(getUserIdFromUrl());

  // Update URL with user ID
  const updateUrlWithUserId = (newUserId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('userId', newUserId);
    window.history.replaceState({}, '', url.toString());
  };

  // Update URL when userId changes
  useEffect(() => {
    updateUrlWithUserId(userId);
  }, [userId]);







  // Show embedded test if requested
  if (showEmbeddedTest) {
    return <TestEmbeddedChat />;
  }

  // Show simple test if requested
  if (showSimpleTest) {
    return <SimpleTest />;
  }

  // Handle embedded chat messages
  const handleEmbeddedMessage = (message: ChatMessage) => {
    console.log('Embedded chat message:', message);
    // You can add analytics, notifications, etc. here
  };

  const handleEmbeddedError = (error: string) => {
    console.error('Embedded chat error:', error);
    // You can show user notifications here
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>Inprove Streaming Demo</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-id-label">User ID:</span>
            <span className="user-id-value">{userId}</span>
            <button 
              onClick={() => {
                const newUserId = 'web_user_' + Math.random().toString(36).substr(2, 9);
                setUserId(newUserId);
              }}
              className="new-user-button"
              title="Generate new user ID"
            >
              🔄 New User
            </button>
          </div>
          <div className="response-type-selector">
            <label>
              Response Type:
              <select 
                value={responseType} 
                onChange={(e) => setResponseType(e.target.value as 'default' | 'text' | 'audio' | 'video')}
                className="response-type-select"
              >
                <option value="default">DEFAULT</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>
          <button 
            onClick={() => setShowSimpleTest(true)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginRight: '8px'
            }}
          >
            🧪 Simple Test
          </button>
          <button 
            onClick={() => setShowEmbeddedTest(true)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginRight: '8px'
            }}
          >
            🧪 Full Test
          </button>
          <button 
            onClick={() => setCompactMode(!compactMode)}
            style={{
              padding: '8px 16px',
              background: compactMode ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title={compactMode ? 'Switch to full layout' : 'Use compact layout'}
          >
            {compactMode ? '🔄 Full Layout' : '📦 Compact Layout'}
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Chat Component - Handles everything */}
        <div className="chat-container">
            <div style={{ height: '600px', width: '100%' }}>
              <ChatComponent
                apiUrl={API_BASE_URL}
                apiKey="test-api-key"
                userId={userId}
                theme="light"
                height="100%"
                width="100%"
                compactMode={compactMode}
                // Enable all features for main interface
                enableText={true}
                enableAudio={true}
                enableVideo={true}
                enableAvatar={true}
                enableCamera={true}
                enableResponseTypeSelector={true}
                responseType={responseType}
                onMessage={handleEmbeddedMessage}
                onError={handleEmbeddedError}
                onAvatarVideoPlay={(videoUrl: string) => {
                  console.log('Avatar video play:', videoUrl);
                }}
                className="embedded-chat-in-main"
                style={{ 
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: 'none'
                }}
                            />
            </div>
          </div>
        </div>


    </div>
  );
}

export default App;
