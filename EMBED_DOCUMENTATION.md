# Chat Component Embed Documentation

## 📋 Overview

The chat component can be embedded in other websites using an iframe. The embed page is located at `/embed` and accepts configuration parameters via URL. The component is now integrated directly into the main project for better deployment compatibility.

## 🚀 Basic Usage

### Simple Embed
```html
<iframe 
  src="https://your-domain.com/embed"
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

### With Configuration Parameters
```html
<iframe 
  src="https://your-domain.com/embed?theme=dark&compactMode=false&enableAudio=false"
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

## ⚙️ Configuration Parameters

All parameters are optional and have sensible defaults:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiUrl` | string | `http://localhost:8080` | Backend API URL |
| `apiKey` | string | `test-api-key` | API key for authentication |
| `userId` | string | auto-generated | Unique user identifier |
| `theme` | `light` \| `dark` | `light` | Visual theme |
| `height` | string | `100%` | Component height |
| `width` | string | `100%` | Component width |
| `compactMode` | boolean | `true` | Layout mode (true=compact, false=full) |
| `enableText` | boolean | `true` | Enable text messaging |
| `enableAudio` | boolean | `true` | Enable audio recording |
| `enableVideo` | boolean | `true` | Enable video responses |
| `enableAvatar` | boolean | `true` | Enable avatar integration |
| `enableCamera` | boolean | `true` | Enable camera controls |
| `enableResponseTypeSelector` | boolean | `true` | Enable response type dropdown |
| `responseType` | `default` \| `text` \| `audio` \| `video` | `default` | Default response type |

## 🎯 Usage Examples

### 1. Compact Mode (Default)
```html
<iframe 
  src="https://your-domain.com/embed"
  width="400px" 
  height="500px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

### 2. Full Layout Mode
```html
<iframe 
  src="https://your-domain.com/embed?compactMode=false"
  width="800px" 
  height="600px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

### 3. Dark Theme
```html
<iframe 
  src="https://your-domain.com/embed?theme=dark"
  width="100%" 
  height="500px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

### 4. Text-Only Mode
```html
<iframe 
  src="https://your-domain.com/embed?enableAudio=false&enableVideo=false&enableCamera=false&enableResponseTypeSelector=false"
  width="400px" 
  height="500px" 
  frameborder="0">
</iframe>
```

### 5. Custom API Configuration
```html
<iframe 
  src="https://your-domain.com/embed?apiUrl=https://api.inproveapp.com&apiKey=your-api-key"
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="microphone; camera">
</iframe>
```

## 📡 Communication with Parent Window

The embed page can communicate with the parent window using `postMessage`:

### Listening for Events
```javascript
window.addEventListener('message', function(event) {
  if (event.data.type === 'CHAT_MESSAGE') {
    console.log('New message:', event.data.message);
  }
  
  if (event.data.type === 'CHAT_ERROR') {
    console.error('Chat error:', event.data.error);
  }
  
  if (event.data.type === 'AVATAR_VIDEO_PLAY') {
    console.log('Avatar video:', event.data.videoUrl);
  }
});
```

### Event Types
- **`CHAT_MESSAGE`** - When a new message is sent/received
- **`CHAT_ERROR`** - When an error occurs
- **`AVATAR_VIDEO_PLAY`** - When an avatar video starts playing

## 🔒 Security Considerations

### CORS Configuration
Make sure your backend allows requests from the domain where you're embedding the iframe:

```python
# In your FastAPI app
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-website.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Domain Validation
The component includes domain validation. Add your domain to the allowed list in the component:

```typescript
const allowedDomains = [
  'inproveapp.com',
  'yourcompany.com',
  'your-website.com', // Add your domain here
  'localhost',
  '127.0.0.1'
];
```

## 🎨 Styling

### Responsive Design
The embed page is designed to be responsive. Use CSS to control the iframe size:

```css
.chat-iframe {
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .chat-iframe {
    height: 500px;
  }
}
```

### Custom Styling
You can customize the appearance by modifying the CSS in `EmbedPage.css`.

## 🚀 Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Your Server
Deploy the `build` folder to your web server.

### 3. Configure Your Domain
Update the domain validation in the component to include your domain.

### 4. Test the Embed
Test the embed page at `https://your-domain.com/embed`

## 🔧 Development

### Local Development
```bash
npm start
```

### Test Embed Page
Visit `http://localhost:3000/embed` to test the embed page locally.

### Test with Parameters
Visit `http://localhost:3000/embed?theme=dark&compactMode=false` to test with parameters.

## 📊 Analytics and Monitoring

### Console Logging
The embed page logs events to the console for debugging:
- Chat messages
- Errors
- Avatar video events

### Parent Window Communication
Events are sent to the parent window for integration with your website's analytics.

## 🐛 Troubleshooting

### Common Issues

1. **Iframe not loading**
   - Check CORS configuration
   - Verify domain is in allowed list
   - Check browser console for errors

2. **Microphone/Camera not working**
   - Ensure `allow="microphone; camera"` is set
   - Check browser permissions
   - Verify HTTPS is used (required for media access)

3. **Styling issues**
   - Check iframe dimensions
   - Verify CSS is not conflicting
   - Test in different browsers

4. **Communication not working**
   - Check browser console for errors
   - Verify event listener is set up correctly
   - Test with simple message first

### Debug Mode
Add `?debug=true` to the URL to enable additional console logging.

---

*For more information, see the main component documentation.* 