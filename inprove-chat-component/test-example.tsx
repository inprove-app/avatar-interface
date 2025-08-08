import React from 'react';
import { ChatComponent } from './src/ChatComponent';
import { Message } from './src/types';

// Example usage of the ChatComponent
function TestApp() {
  const handleNewMessage = (message: Message) => {
    console.log('New message received:', message);
  };

  const handleError = (error: string) => {
    console.error('Chat error:', error);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Chat Component Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Light Theme</h2>
        <ChatComponent
          apiUrl="http://localhost:8080"
          apiKey="test-api-key"
          userId="test-user-1"
          theme="light"
          height="300px"
          width="400px"
          onMessage={handleNewMessage}
          onError={handleError}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Dark Theme</h2>
        <ChatComponent
          apiUrl="http://localhost:8080"
          apiKey="test-api-key"
          userId="test-user-2"
          theme="dark"
          height="300px"
          width="400px"
          onMessage={handleNewMessage}
          onError={handleError}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Custom Styling</h2>
        <ChatComponent
          apiUrl="http://localhost:8080"
          apiKey="test-api-key"
          userId="test-user-3"
          theme="light"
          height="250px"
          width="100%"
          onMessage={handleNewMessage}
          onError={handleError}
          className="custom-chat"
          style={{ 
            border: '2px solid #667eea',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </div>
  );
}

export default TestApp; 