import React from 'react';
import { ChatComponent } from '@inprove/chat-component';

const SimpleTest: React.FC = () => {
  const handleNewMessage = (message: any) => {
    console.log('New message:', message);
  };

  const handleError = (error: string) => {
    console.error('Chat error:', error);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Simple Chat Component Test</h1>
      
      <div style={{ 
        background: '#e3f2fd', 
        border: '1px solid #2196f3', 
        borderRadius: '4px', 
        padding: '12px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginTop: 0, color: '#1976d2' }}>📋 Test Information</h3>
        <p>This page tests the embedded chat component with compact mode.</p>
        <p><strong>Note:</strong> Make sure your backend server is running on localhost:8080</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🎨 Compact Mode Chat Component</h2>
        <p>This example shows the component in compact mode (no avatar/camera cards):</p>
        <ul>
          <li>✅ Text messaging</li>
          <li>✅ Audio recording</li>
          <li>✅ Camera controls</li>
          <li>✅ Video responses</li>
          <li>✅ Response type selector</li>
          <li>❌ No avatar/camera cards (compact mode)</li>
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
        />
      </div>

      <div style={{ 
        marginTop: '20px', 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2>📊 Test Checklist</h2>
        <p>Check the browser console for:</p>
        <ul>
          <li>✅ Component loads without errors</li>
          <li>✅ WebSocket connection status</li>
          <li>✅ Text message sending/receiving</li>
          <li>✅ Audio recording functionality</li>
          <li>✅ Camera controls</li>
          <li>✅ Error handling</li>
          <li>✅ Domain validation</li>
          <li>✅ API key authentication</li>
          <li>✅ Compact mode layout (no avatar/camera cards)</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleTest; 