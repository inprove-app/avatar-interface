# Inprove Embedded Chat Page

This is a standalone chat page that contains only the `ChatComponent` and is designed to be embedded in other websites.

## Features

- **Standalone Chat Interface** - Contains only the essential chat functionality
- **Embeddable Design** - Clean, focused interface perfect for embedding
- **User Management** - User ID generation and management
- **Response Type Control** - Choose between text, audio, and video responses
- **Avatar Video Support** - Display AI avatar videos when available
- **Real-time Communication** - WebSocket-based real-time messaging
- **Responsive Design** - Works on desktop and mobile devices

## Usage

### Running the Embedded Chat Page

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Access the chat page:**
   - Main app: `http://localhost:3000`
   - Embedded chat: `http://localhost:3000?embedded=true`

### Embedding in Other Websites

The chat page can be embedded in other websites using an iframe:

**Production mode (clean interface):**
```html
<iframe 
  src="http://localhost:3000?embedded=true" 
  width="800" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
```

**Development mode (with debug controls):**
```html
<iframe 
  src="http://localhost:3000?embedded=true&dev=true" 
  width="800" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
```

### URL Parameters

The chat page supports URL parameters for customization:

- `userId` - Set a specific user ID (optional, auto-generated if not provided)
- `dev` - Enable development mode to show debug controls (default: false)

Examples:
```
# Production mode (clean interface)
http://localhost:3000?embedded=true

# Development mode (with debug controls)
http://localhost:3000?embedded=true&dev=true

# With custom user ID
http://localhost:3000?embedded=true&userId=custom_user_123

# Development mode with custom user ID
http://localhost:3000?embedded=true&dev=true&userId=custom_user_123
```

## Component Structure

### ChatPage.tsx
- **Main container** for the embedded chat interface
- **Header** with user controls and response type selector
- **Avatar video area** for displaying AI avatar responses
- **ChatComponent** integration
- **Status footer** with connection and message count

### ChatComponent.tsx
- **Message handling** - Display and manage chat messages
- **Input controls** - Text input and audio recording
- **WebSocket connection** - Real-time communication
- **Message history** - Load and display conversation history
- **API integration** - Send messages to the backend

## Styling

The embedded chat page uses `ChatPage.css` for styling, providing:
- **Clean, modern design** with purple gradient header
- **Responsive layout** that adapts to different screen sizes
- **Embeddable-friendly styling** with proper borders and shadows
- **Mobile-optimized** interface for touch devices

## API Integration

The chat page communicates with the same backend endpoints:
- **POST** `/agent-webhook/inprove` - Send messages
- **GET** `/messages/{userId}` - Load message history
- **WebSocket** `/ws/{userId}` - Real-time updates

## Environment Variables

Set these environment variables for the chat page:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

## Building for Production

```bash
npm run build
```

The built files will be in the `build/` directory and can be deployed to any static hosting service.

## Customization

### Styling
Modify `ChatPage.css` to customize the appearance:
- Colors and gradients
- Layout and spacing
- Responsive breakpoints
- Typography

### Functionality
Extend `ChatPage.tsx` to add features:
- Custom user authentication
- Additional controls
- Analytics integration
- Custom branding

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

- **Connection issues**: Ensure the backend server is running
- **Audio recording**: Check browser microphone permissions
- **WebSocket errors**: Verify the WebSocket URL is correct
- **Styling issues**: Check CSS compatibility with the parent website
