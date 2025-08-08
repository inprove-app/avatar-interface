# Complete Chat Component Documentation

## 📋 Overview

The `@inprove/chat-component` is now a **complete, self-contained chat interface** that handles all features (text, audio, video, avatar, camera) with configurable toggles and layout modes. This eliminates the need to split logic between the main page and component.

## 🏗️ New Architecture

### Complete Feature Set
```
ChatComponent
├── Text Messaging ✅
├── Audio Recording ✅
├── Video Responses ✅
├── Avatar Integration ✅
├── Camera Controls ✅
├── Response Type Selection ✅
├── WebSocket Communication ✅
├── Message History ✅
├── Security Features ✅
└── Layout Modes ✅
```

### Configurable Features
- **`enableText`** - Text messaging (default: true)
- **`enableAudio`** - Audio recording (default: true)
- **`enableVideo`** - Video responses (default: true)
- **`enableAvatar`** - Avatar video integration (default: true)
- **`enableCamera`** - Camera controls (default: true)
- **`enableResponseTypeSelector`** - Response type dropdown (default: true)

### Layout Modes
- **`compactMode`** - Layout mode (default: true)
  - **`true`** - Compact mode: Just the chat interface
  - **`false`** - Full mode: Avatar and camera cards + chat

## 🚀 Usage Examples

### Compact Mode (Default)
```tsx
<ChatComponent
  apiUrl="https://api.inproveapp.com"
  apiKey="your-api-key"
  userId="user123"
  theme="light"
  height="600px"
  width="100%"
  compactMode={true} // Default - just chat interface
  // Enable all features
  enableText={true}
  enableAudio={true}
  enableVideo={true}
  enableAvatar={true}
  enableCamera={true}
  enableResponseTypeSelector={true}
  onMessage={(message) => console.log('New message:', message)}
  onError={(error) => console.error('Error:', error)}
  onAvatarVideoPlay={(videoUrl) => console.log('Avatar video:', videoUrl)}
/>
```

### Full Layout Mode
```tsx
<ChatComponent
  apiUrl="https://api.inproveapp.com"
  apiKey="your-api-key"
  userId="user123"
  theme="light"
  height="600px"
  width="100%"
  compactMode={false} // Full layout with avatar/camera cards
  // Enable all features
  enableText={true}
  enableAudio={true}
  enableVideo={true}
  enableAvatar={true}
  enableCamera={true}
  enableResponseTypeSelector={true}
  onMessage={(message) => console.log('New message:', message)}
  onError={(error) => console.error('Error:', error)}
  onAvatarVideoPlay={(videoUrl) => console.log('Avatar video:', videoUrl)}
/>
```

### Minimal Configuration
```tsx
<ChatComponent
  apiUrl="https://api.inproveapp.com"
  apiKey="your-api-key"
  userId="user123"
  // All features enabled by default, compact mode
/>
```

## 🔧 Updated Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | **required** | Backend API URL |
| `apiKey` | `string` | **required** | API key for authentication |
| `userId` | `string` | auto-generated | Unique user identifier |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme |
| `height` | `string` | `'400px'` | Component height |
| `width` | `string` | `'100%'` | Component width |
| `compactMode` | `boolean` | `true` | Layout mode (true=compact, false=full) |
| `enableText` | `boolean` | `true` | Enable text messaging |
| `enableAudio` | `boolean` | `true` | Enable audio recording |
| `enableVideo` | `boolean` | `true` | Enable video responses |
| `enableAvatar` | `boolean` | `true` | Enable avatar integration |
| `enableCamera` | `boolean` | `true` | Enable camera controls |
| `enableResponseTypeSelector` | `boolean` | `true` | Enable response type dropdown |
| `responseType` | `'default' \| 'text' \| 'audio' \| 'video'` | `'default'` | Default response type |
| `onMessage` | `(message: Message) => void` | `undefined` | Message callback |
| `onError` | `(error: string) => void` | `undefined` | Error callback |
| `onAvatarVideoPlay` | `(videoUrl: string) => void` | `undefined` | Avatar video callback |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` | Inline styles |

## 📨 Enhanced Message Interface

```typescript
interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  message_type: string;
  timestamp: string;
  is_from_bot: boolean;
  audioBlob?: Blob;        // User audio messages
  audio_url?: string;       // Bot audio responses
  video_url?: string;       // Bot video responses
}
```

## 🎯 Benefits of New Architecture

### 1. **Complete Self-Contained Component**
- ✅ All logic in one place
- ✅ No split between page and component
- ✅ Easier to maintain and debug

### 2. **Flexible Configuration**
- ✅ Enable/disable features as needed
- ✅ Choose layout mode (compact vs full)
- ✅ Perfect for different use cases
- ✅ Embedding-friendly options

### 3. **Consistent API**
- ✅ Same component for all scenarios
- ✅ Predictable behavior
- ✅ Easy to understand

### 4. **Better Integration**
- ✅ Main interface uses same component
- ✅ Test pages show different configs
- ✅ Consistent user experience

## 🔄 Migration from Old Approach

### Before (Split Logic)
```tsx
// Main page had audio/video logic
// Component only had text logic
// Hard to maintain and debug
```

### After (Complete Component)
```tsx
// Single component handles everything
// Configure features and layout as needed
// Clean and maintainable
```

## 🧪 Testing Configurations

### Test Pages Updated
1. **SimpleTest.tsx** - Compact mode configuration
2. **TestEmbeddedChat.tsx** - Multiple configurations (compact vs full)
3. **Main App.tsx** - Full features with layout toggle

### Test Scenarios
- ✅ Compact mode (main interface)
- ✅ Full layout mode (with avatar/camera cards)
- ✅ Dark theme
- ✅ Custom styling
- ✅ Feature toggles
- ✅ Layout mode switching

## 🚀 Implementation in Main App

The main App.tsx now uses the complete component with layout toggle:

```tsx
// In main interface - all features enabled with layout toggle
<ChatComponent
  apiUrl={API_BASE_URL}
  apiKey="test-api-key"
  userId={userId}
  compactMode={compactMode} // Toggle between compact and full layout
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
  onAvatarVideoPlay={(videoUrl) => {
    setAvatarVideoUrl(videoUrl);
    setIsAvatarPlaying(true);
  }}
/>
```

## 🔒 Security Features

- ✅ **Domain validation** - Only authorized domains
- ✅ **API key authentication** - Secure API calls
- ✅ **Error callbacks** - Proper error handling
- ✅ **Console logging** - Debug information

## 🎨 Styling System

### Enhanced CSS Classes
```css
.inprove-chat-component     /* Compact mode container */
.inprove-chat-component-full /* Full layout container */
.full-layout               /* Full layout wrapper */
.video-section             /* Avatar/camera cards section */
.video-card               /* Individual video card */
.chat-section             /* Chat messages section */
.chat-header              /* Header with response selector */
.messages-container       /* Messages area */
.message                  /* Individual message */
.audio-message           /* Audio message styling */
.video-message           /* Video message styling */
.input-section           /* Input area */
.record-button           /* Audio recording button */
.camera-controls         /* Camera toggle */
.camera-feed             /* Camera video */
.text-input-container    /* Text input area */
```

### Dark Theme Support
- ✅ Complete dark theme
- ✅ All components styled
- ✅ Consistent theming
- ✅ Both compact and full layouts

## 📊 Performance Considerations

### Optimizations
- ✅ **Memoized callbacks** - Prevent unnecessary re-renders
- ✅ **Conditional rendering** - Only render enabled features
- ✅ **Efficient state management** - Minimal state updates
- ✅ **Cleanup on unmount** - Proper resource management

### Bundle Size
- ✅ **Feature toggles** - Only include needed code
- ✅ **Conditional imports** - Lazy load features
- ✅ **Minimal dependencies** - Lightweight component

## 🔮 Future Enhancements

### Planned Features
- [ ] **Message reactions** - Like/dislike responses
- [ ] **File attachments** - Image/document support
- [ ] **Typing indicators** - Show when bot is typing
- [ ] **Message search** - Search conversation history
- [ ] **Export chat** - Download conversation
- [ ] **Custom themes** - More theme options
- [ ] **Accessibility** - ARIA labels and keyboard nav

### Backend Enhancements
- [ ] **WebSocket authentication** - Secure real-time connections
- [ ] **Rate limiting** - Prevent abuse
- [ ] **Message encryption** - End-to-end encryption
- [ ] **Analytics** - Usage tracking and metrics

## 📚 Additional Resources

### Documentation
- **Component README**: `inprove-chat-component/README.md`
- **Main Interface README**: `README.md`
- **Backend API Docs**: See backend repository

### Code Examples
- **Compact mode**: See `src/SimpleTest.tsx`
- **Full layout**: See `src/TestEmbeddedChat.tsx`
- **Main integration**: See `src/App.tsx`

### Support
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: This file and component README
- **Development Team**: For technical questions

---

*This documentation is maintained by the Inprove development team. For questions or contributions, please contact the team.* 