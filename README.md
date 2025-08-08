# Inprove Web Interface

A React-based web interface for the Inprove AI system, featuring real-time chat, avatar interactions, and an embeddable chat component.

## 🚀 Features

### Main Interface
- **Real-time chat** with AI avatar
- **Audio recording** and transcription
- **Video responses** with avatar animation
- **Camera integration** for user video
- **Message history** and persistence
- **Response type selection** (text, audio, video)
- **User ID persistence** via URL parameters

### Embedded Chat Component
- **Lightweight** text-only chat component
- **Easy integration** into any React app
- **Security features** (domain validation, API key auth)
- **Customizable** themes and styling
- **TypeScript support** with full type definitions

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/inprove-app/avatar-interface.git
cd avatar-interface

# Install dependencies
npm install

# Start development server
npm start
```

## 🎯 Usage

### Main Interface
The main interface provides a full-featured chat experience with avatar interactions:

```tsx
// Access via URL parameters
http://localhost:3000?userId=my-user-id
```

### Embedded Component
Use the embedded component in your own applications:

```tsx
import { ChatComponent } from './inprove-chat-component';

function App() {
  return (
    <ChatComponent
      apiUrl="https://api.inproveapp.com"
      apiKey="your-api-key"
      userId="user123"
      theme="light"
      height="400px"
      width="100%"
      onMessage={(message) => console.log('New message:', message)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

## 🏗️ Project Structure

```
inprove-web-interface/
├── src/
│   ├── App.tsx                    # Main application
│   ├── TestEmbeddedChat.tsx       # Embedded component testing
│   ├── SimpleTest.tsx             # Basic component testing
│   └── App.css                    # Main styles
├── inprove-chat-component/        # Embedded chat component
│   ├── src/
│   │   ├── ChatComponent.tsx      # Main component
│   │   ├── ChatComponent.css      # Component styles
│   │   ├── types.ts               # TypeScript interfaces
│   │   └── index.ts               # Exports
│   ├── dist/                      # Built files
│   ├── package.json               # Component package
│   ├── tsconfig.json              # TypeScript config
│   └── README.md                  # Component documentation
├── public/                        # Static assets
├── package.json                   # Main app package
└── README.md                      # This file
```

## 🔧 Development

### Main Interface Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Test the application
npm test
```

### Embedded Component Development

```bash
# Navigate to component directory
cd inprove-chat-component

# Install dependencies
npm install

# Build the component
npm run build

# Reinstall in main app
cd ..
npm uninstall @inprove/chat-component
npm install ./inprove-chat-component --legacy-peer-deps

# Clear cache and restart
npm cache clean --force
rm -rf node_modules/.cache
npm start -- --reset-cache
```

## 🧪 Testing

### Test Pages
The application includes test pages for the embedded component:

1. **Simple Test** (`/simple-test`)
   - Basic functionality testing
   - Single component instance
   - Quick verification

2. **Full Test** (`/full-test`)
   - Multiple component instances
   - Different themes and styles
   - Comprehensive testing

### Testing Checklist
- [ ] Main interface loads correctly
- [ ] Audio recording works
- [ ] Video responses display
- [ ] Camera integration functions
- [ ] Embedded component loads
- [ ] WebSocket connections work
- [ ] Message sending/receiving
- [ ] Error handling
- [ ] Domain validation
- [ ] API key authentication

## 🔒 Security

### Domain Validation
The embedded component only works on authorized domains:
- `inproveapp.com`
- `yourcompany.com`
- `localhost` (development)
- `127.0.0.1` (development)

### API Key Authentication
All API requests require valid API keys:
```
Authorization: Bearer your-api-key
```

## 🌐 Backend Requirements

### Required Endpoints

1. **GET /messages/{user_id}**
   - Returns message history
   - Requires API key authentication

2. **POST /agent-webhook/inprove**
   - Processes new messages
   - Requires API key authentication

3. **WebSocket /ws/{user_id}**
   - Real-time message delivery
   - No authentication required (for now)

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

## 🚀 Deployment

### AWS Amplify
The project is configured for AWS Amplify deployment:

```bash
# Build specification
amplify.yml

# Environment variables
REACT_APP_API_URL=https://api.inproveapp.com
REACT_APP_WS_URL=wss://api.inproveapp.com
```

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy to your hosting service
# (e.g., AWS S3, Netlify, Vercel)
```

## 🐛 Troubleshooting

### Common Issues

1. **Component Not Loading**
   - Clear browser cache
   - Check console for errors
   - Verify API endpoints

2. **WebSocket Connection Failed**
   - Check WebSocket URL format
   - Verify backend is running
   - Check CORS configuration

3. **API Key Errors**
   - Verify API key is valid
   - Check backend authentication
   - Ensure domain is authorized

4. **Build Errors**
   - Clear npm cache
   - Remove node_modules
   - Reinstall dependencies

### Debug Mode
Enable debug logging in browser console:
- WebSocket connection status
- API request/response logs
- Error messages and stack traces

## 📚 Documentation

- **Main Interface**: See `src/App.tsx` for implementation details
- **Embedded Component**: See `inprove-chat-component/README.md` for complete documentation
- **Backend Integration**: See backend repository for API documentation

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

## 📄 License

MIT License - see LICENSE file for details.
