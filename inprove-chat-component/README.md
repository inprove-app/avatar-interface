# @inprove/chat-component

A lightweight, embeddable chat component for React applications that provides text-based communication with the Inprove AI system.

## 🚀 Features

- **Text-only messaging** - Simple, clean chat interface
- **Real-time communication** - WebSocket-based message delivery
- **Message history** - Loads previous conversation history
- **Theme support** - Light and dark themes
- **Customizable styling** - Flexible CSS classes and inline styles
- **Security** - Domain validation and API key authentication
- **TypeScript support** - Full type definitions included
- **Responsive design** - Works on desktop and mobile

## 📦 Installation

### From GitHub Packages (Recommended)

```bash
npm install @inprove/chat-component
```

### From Local Development

```bash
npm install ../path/to/inprove-chat-component --legacy-peer-deps
```

## 🎯 Quick Start

```tsx
import React from 'react';
import { ChatComponent } from '@inprove/chat-component';

function App() {
  const handleNewMessage = (message) => {
    console.log('New message:', message);
  };

  const handleError = (error) => {
    console.error('Chat error:', error);
  };

  return (
    <ChatComponent
      apiUrl="https://your-backend.com"
      apiKey="your-api-key"
      userId="user123"
      theme="light"
      height="400px"
      width="100%"
      onMessage={handleNewMessage}
      onError={handleError}
    />
  );
}
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | **required** | Backend API URL (e.g., "https://api.inproveapp.com") |
| `apiKey` | `string` | **required** | API key for authentication |
| `userId` | `string` | auto-generated | Unique user identifier |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme |
| `height` | `string` | `'400px'` | Component height |
| `width` | `string` | `'100%'` | Component width |
| `onMessage` | `(message: Message) => void` | `undefined` | Callback for new messages |
| `onError` | `(error: string) => void` | `undefined` | Callback for errors |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` | Inline styles |

## 📨 Message Interface

```typescript
interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  message_type: string;
  timestamp: string;
  is_from_bot: boolean;
}
```

## 🔒 Security Features

### Domain Validation
The component only works on authorized domains:
- `inproveapp.com`
- `yourcompany.com`
- `localhost` (development)
- `127.0.0.1` (development)

### API Key Authentication
All requests include the API key in the Authorization header:
```
Authorization: Bearer your-api-key
```

## 🎨 Styling

### CSS Classes
The component uses these CSS classes for styling:
- `.inprove-chat-component` - Main container
- `.chat-header` - Header section
- `.messages-container` - Messages area
- `.message` - Individual message
- `.message.bot` - Bot message
- `.message.user` - User message
- `.input-section` - Input area
- `.text-input` - Text input field

### Custom Styling Example
```tsx
<ChatComponent
  apiUrl="https://api.inproveapp.com"
  apiKey="your-key"
  className="my-custom-chat"
  style={{
    border: '2px solid #667eea',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }}
/>
```

## 🔧 Backend Requirements

### Required Endpoints

1. **GET /messages/{user_id}**
   - Returns message history
   - Requires API key authentication
   - Response: `{ status: 'success', messages: [...] }`

2. **POST /agent-webhook/inprove**
   - Processes new messages
   - Requires API key authentication
   - Request: `{ type: 'text', sender, receiver, text, timestamp, messageId }`

3. **WebSocket /ws/{user_id}**
   - Real-time message delivery
   - Sends: `{ type: 'new_message', message: {...} }`

### API Key Validation
The backend must validate the `Authorization: Bearer {api_key}` header on HTTP endpoints.

## 🛠️ Development

### Building the Component

```bash
# Install dependencies
npm install

# Build the component
npm run build

# The build creates:
# - dist/ChatComponent.js (compiled JavaScript)
# - dist/ChatComponent.css (styles)
# - dist/index.js (entry point)
# - dist/*.d.ts (TypeScript definitions)
```

### Development Workflow

1. **Make changes** to `src/ChatComponent.tsx`
2. **Build** with `npm run build`
3. **Reinstall** in your project:
   ```bash
   cd ../your-project
   npm uninstall @inprove/chat-component
   npm install ../inprove-chat-component --legacy-peer-deps
   ```
4. **Clear cache** and restart:
   ```bash
   npm cache clean --force
   rm -rf node_modules/.cache
   npm start -- --reset-cache
   ```

### Project Structure
```
inprove-chat-component/
├── src/
│   ├── ChatComponent.tsx    # Main component
│   ├── ChatComponent.css    # Styles
│   ├── types.ts            # TypeScript interfaces
│   └── index.ts            # Exports
├── dist/                   # Built files
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

### Test Components
The main web interface includes test components:
- `TestEmbeddedChat.tsx` - Full feature testing
- `SimpleTest.tsx` - Basic functionality testing

### Manual Testing Checklist
- [ ] Component loads without errors
- [ ] WebSocket connects successfully
- [ ] Messages send and receive
- [ ] Message history loads
- [ ] Error handling works
- [ ] Domain validation works
- [ ] API key authentication works
- [ ] Themes display correctly
- [ ] Custom styling applies

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors**
   - Check API endpoints are correct
   - Verify backend is running
   - Ensure API key is valid

2. **403 Forbidden**
   - Check API key authentication
   - Verify domain is authorized

3. **WebSocket Connection Failed**
   - Check WebSocket URL format
   - Verify backend WebSocket endpoint

4. **Component Not Updating**
   - Clear npm cache: `npm cache clean --force`
   - Remove node_modules cache: `rm -rf node_modules/.cache`
   - Restart with cache reset: `npm start -- --reset-cache`

5. **TypeScript Errors**
   - Check React version compatibility
   - Use `--legacy-peer-deps` for installation

### Debug Mode
Enable console logging by checking browser developer tools for:
- WebSocket connection status
- API request/response logs
- Error messages

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check this documentation
- Review the troubleshooting section
- Open an issue on GitHub
- Contact the development team 