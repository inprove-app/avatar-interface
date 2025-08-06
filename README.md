# Inprove Web Interface

A React-based web interface for communicating with the Inprove AI bot. This interface allows users to send text and audio messages to the bot and receive responses in real-time.

## Features

- **Simple messaging**: Send text messages to the AI bot
- **Audio recording**: Record and send audio messages
- **Local message history**: View conversation history stored locally
- **Real-time responses**: Receive immediate responses from the bot
- **Responsive design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- The Inprove backend server running on port 8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Usage

1. **Send text messages**: 
   - Toggle the "Text" checkbox to enable text mode
   - Type your message in the input field
   - Press Enter or click "Send"
2. **Send audio messages**:
   - Click "Start Recording" to begin recording
   - Speak your message
   - Click "Stop Recording" to send the audio
3. **View messages**: All messages appear in the chat area with timestamps
4. **Monitor status**: Check the API status and message count at the bottom of the page

## API Endpoints

The interface communicates with the following backend endpoint:

- `POST /api/v1/agent-webhook/inprove` - Send messages to the bot and receive responses

## Development

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.tsx        # Application entry point
└── ...
```

### Key Components

- **App.tsx**: Main component handling the interface layout and functionality
- **Message Interface**: Defines the structure of chat messages
- **Connection Status**: Manages connection state with the bot

### Styling

The interface uses CSS modules and follows a modern design with:
- Purple gradient header
- White cards with rounded corners
- Responsive layout
- Smooth animations and transitions

## Troubleshooting

- **Connection issues**: Ensure the backend server is running on the correct port
- **Audio recording**: Make sure your browser has permission to access the microphone
- **Messages not appearing**: Check the browser console for API errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Inprove system.
