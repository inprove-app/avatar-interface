import React, { useState, useRef } from 'react';
import ChatComponent from './ChatComponent';
import './ChatPage.css';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  message_type: string;
  timestamp: string;
  is_from_bot: boolean;
  audioBlob?: Blob;
  audio_url?: string;
  video_url?: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseType, setResponseType] = useState<'default' | 'text' | 'audio' | 'video'>('default');
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string>('');
  const [isAvatarPlaying, setIsAvatarPlaying] = useState<boolean>(false);
  
  const avatarVideoRef = useRef<HTMLVideoElement>(null);

  // Get user ID from URL parameter or generate a new one
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || 'web_user_' + Math.random().toString(36).substr(2, 9);
  };

  const [userId, setUserId] = useState(getUserIdFromUrl());

  // Get dev mode from URL parameter (default: false)
  const getDevModeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('dev') === 'true';
  };

  const [devMode, setDevMode] = useState(getDevModeFromUrl());

  // Update URL with user ID
  const updateUrlWithUserId = (newUserId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('userId', newUserId);
    window.history.replaceState({}, '', url.toString());
  };

  // Update URL when userId changes
  React.useEffect(() => {
    updateUrlWithUserId(userId);
  }, [userId]);

  return (
    <div className="chat-page">
      {/* Header for embedded chat */}
      <header className="chat-header">
        <div className="chat-header-content">
          <h2>AI Chat Assistant</h2>
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
        </div>
        {devMode && (
          <div className="chat-controls">
            <div className="user-info">
              <span>User ID: {userId}</span>
              <button 
                onClick={() => {
                  const newUserId = 'web_user_' + Math.random().toString(36).substr(2, 9);
                  setUserId(newUserId);
                  setMessages([]); // Clear messages for new user
                }}
                className="new-user-button"
                title="Generate new user ID"
              >
                🔄 New User
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main chat area */}
      <div className="chat-main">
        {/* Avatar video area */}
        {avatarVideoUrl && isAvatarPlaying && (
          <div className="avatar-video-container">
            <video 
              ref={avatarVideoRef}
              src={avatarVideoUrl}
              autoPlay={isAvatarPlaying}
              playsInline 
              className="avatar-video"
              onEnded={() => setIsAvatarPlaying(false)}
              onPlay={() => setIsAvatarPlaying(true)}
              onPause={() => setIsAvatarPlaying(false)}
            />
          </div>
        )}

        {/* Chat component */}
        <ChatComponent
          userId={userId}
          responseType={responseType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          messages={messages}
          setMessages={setMessages}
          setAvatarVideoUrl={setAvatarVideoUrl}
          setIsAvatarPlaying={setIsAvatarPlaying}
          avatarVideoRef={avatarVideoRef}
        />
      </div>

      {/* Status footer - only shown in dev mode */}
      {devMode && (
        <footer className="chat-footer">
          <div className="status-info">
            <span>Status: {isLoading ? 'Processing...' : 'Ready'}</span>
            <span>Messages: {messages.length}</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ChatPage;
