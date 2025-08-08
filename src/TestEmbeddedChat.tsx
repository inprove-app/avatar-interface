import React from 'react';
import { ChatComponent, Message } from '@inprove/chat-component';

const TestEmbeddedChat: React.FC = () => {
  const handleNewMessage = (message: Message) => {
    console.log('New message:', message);
  };

  const handleError = (error: string) => {
    console.error('Chat error:', error);
  };

  const handleAvatarVideoPlay = (videoUrl: string) => {
    console.log('Avatar video play:', videoUrl);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Embedded Chat Component Test</h1>
      
      <div style={{ 
        background: '#e3f2fd', 
        border: '1px solid #2196f3', 
        borderRadius: '4px', 
        padding: '12px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginTop: 0, color: '#1976d2' }}>📋 Test Information</h3>
        <p>This page tests different configurations of the embedded chat component.</p>
        <p><strong>Note:</strong> Make sure your backend server is running on localhost:8080</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>🎨 Compact Mode Test</h2>
          <p>Compact layout (no avatar/camera cards):</p>
          <ul>
            <li>✅ All features enabled</li>
            <li>✅ Compact layout</li>
            <li>✅ No avatar/camera cards</li>
          </ul>
          <ChatComponent
            apiUrl="http://localhost:8080"
            apiKey="test-api-key"
            userId="test-user-compact"
            theme="light"
            height="400px"
            width="100%"
            compactMode={true}
            // Enable all features
            enableText={true}
            enableAudio={true}
            enableVideo={true}
            enableAvatar={true}
            enableCamera={true}
            enableResponseTypeSelector={true}
            onMessage={handleNewMessage}
            onError={handleError}
            onAvatarVideoPlay={handleAvatarVideoPlay}
          />
        </div>

        <div>
          <h2>🌙 Full Layout Test</h2>
          <p>Full layout with avatar and camera cards:</p>
          <ul>
            <li>✅ All features enabled</li>
            <li>✅ Full layout</li>
            <li>✅ Avatar and camera cards</li>
          </ul>
          <ChatComponent
            apiUrl="http://localhost:8080"
            apiKey="test-api-key"
            userId="test-user-full"
            theme="light"
            height="400px"
            width="100%"
            compactMode={false}
            // Enable all features
            enableText={true}
            enableAudio={true}
            enableVideo={true}
            enableAvatar={true}
            enableCamera={true}
            enableResponseTypeSelector={true}
            onMessage={handleNewMessage}
            onError={handleError}
            onAvatarVideoPlay={handleAvatarVideoPlay}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>🔧 Dark Theme Test</h2>
        <p>Dark theme with compact mode:</p>
        <ul>
          <li>✅ Dark theme</li>
          <li>✅ Compact layout</li>
          <li>✅ All features enabled</li>
        </ul>
        <ChatComponent
          apiUrl="http://localhost:8080"
          apiKey="test-api-key"
          userId="test-user-dark"
          theme="dark"
          height="300px"
          width="100%"
          compactMode={true}
          // Enable all features
          enableText={true}
          enableAudio={true}
          enableVideo={true}
          enableAvatar={true}
          enableCamera={true}
          enableResponseTypeSelector={true}
          onMessage={handleNewMessage}
          onError={handleError}
          onAvatarVideoPlay={handleAvatarVideoPlay}
          className="custom-chat-test"
          style={{ 
            border: '2px solid #667eea',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>

      <div style={{ 
        marginTop: '20px', 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2>📊 Test Results</h2>
        <p>Check the browser console for:</p>
        <ul>
          <li>✅ Component loading without errors</li>
          <li>✅ WebSocket connection status</li>
          <li>✅ Message sending/receiving</li>
          <li>✅ Error handling</li>
          <li>✅ Domain validation</li>
          <li>✅ API key authentication</li>
          <li>✅ Themes display correctly</li>
          <li>✅ Feature toggles work</li>
          <li>✅ Layout modes work (compact vs full)</li>
          <li>✅ Custom styling applies</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEmbeddedChat; 