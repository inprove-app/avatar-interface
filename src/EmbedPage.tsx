import React, { useState } from 'react';
import { ChatComponent } from '@inprove/chat-component';
import './EmbedPage.css';

const EmbedPage: React.FC = () => {
  // Get configuration from URL parameters or use defaults
  const getConfigFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      apiUrl: urlParams.get('apiUrl') || process.env.REACT_APP_API_URL || 'http://localhost:8080',
      apiKey: urlParams.get('apiKey') || 'test-api-key',
      userId: urlParams.get('userId') || undefined,
      theme: (urlParams.get('theme') as 'light' | 'dark') || 'light',
      height: urlParams.get('height') || '100%',
      width: urlParams.get('width') || '100%',
      compactMode: urlParams.get('compactMode') !== 'false', // Default to true
      enableText: urlParams.get('enableText') !== 'false', // Default to true
      enableAudio: urlParams.get('enableAudio') !== 'false', // Default to true
      enableVideo: urlParams.get('enableVideo') !== 'false', // Default to true
      enableAvatar: urlParams.get('enableAvatar') !== 'false', // Default to true
      enableCamera: urlParams.get('enableCamera') !== 'false', // Default to true
      enableResponseTypeSelector: urlParams.get('enableResponseTypeSelector') !== 'false', // Default to true
      responseType: (urlParams.get('responseType') as 'default' | 'text' | 'audio' | 'video') || 'default'
    };
  };

  const config = getConfigFromUrl();

  // Handle messages from the component
  const handleMessage = (message: any) => {
    // Send message to parent window if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'CHAT_MESSAGE',
        message: message
      }, '*');
    }
    console.log('Chat message:', message);
  };

  // Handle errors from the component
  const handleError = (error: string) => {
    // Send error to parent window if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'CHAT_ERROR',
        error: error
      }, '*');
    }
    console.error('Chat error:', error);
  };

  // Handle avatar video play
  const handleAvatarVideoPlay = (videoUrl: string) => {
    // Send video play event to parent window if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'AVATAR_VIDEO_PLAY',
        videoUrl: videoUrl
      }, '*');
    }
    console.log('Avatar video play:', videoUrl);
  };

  return (
    <div className="embed-page">
      <ChatComponent
        apiUrl={config.apiUrl}
        apiKey={config.apiKey}
        userId={config.userId}
        theme={config.theme}
        height={config.height}
        width={config.width}
        compactMode={config.compactMode}
        enableText={config.enableText}
        enableAudio={config.enableAudio}
        enableVideo={config.enableVideo}
        enableAvatar={config.enableAvatar}
        enableCamera={config.enableCamera}
        enableResponseTypeSelector={config.enableResponseTypeSelector}
        responseType={config.responseType}
        onMessage={handleMessage}
        onError={handleError}
        onAvatarVideoPlay={handleAvatarVideoPlay}
        className="embedded-chat"
        style={{
          border: 'none',
          borderRadius: '0',
          boxShadow: 'none'
        }}
      />
    </div>
  );
};

export default EmbedPage; 