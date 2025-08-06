import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  message_type: string;
  timestamp: string;
  is_from_bot: boolean;
  audioBlob?: Blob; // For user audio messages
  audio_url?: string; // For bot audio responses
  video_url?: string; // For bot video responses
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [responseType, setResponseType] = useState<'default' | 'text' | 'audio' | 'video'>('default');
  // Get user ID from URL parameter or generate a new one
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || 'web_user_' + Math.random().toString(36).substr(2, 9);
  };

  const [userId, setUserId] = useState(getUserIdFromUrl());

  // Update URL with user ID
  const updateUrlWithUserId = (newUserId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('userId', newUserId);
    window.history.replaceState({}, '', url.toString());
  };

  // Update URL when userId changes
  useEffect(() => {
    updateUrlWithUserId(userId);
  }, [userId]);

  // Load message history when component mounts
  useEffect(() => {
    loadMessageHistory(userId);
  }, [userId]);

  // Load message history
  const loadMessageHistory = async (user: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${user}`);
      if (response.data.status === 'success' && response.data.messages) {
        const historyMessages = response.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          receiver: msg.receiver,
          content: msg.content,
          message_type: msg.message_type,
          timestamp: msg.timestamp,
          is_from_bot: msg.is_from_bot,
          audio_url: msg.audio_url,
          video_url: msg.video_url
        }));
        setMessages(historyMessages);
        console.log(`Loaded ${historyMessages.length} messages from history`);
      }
    } catch (error) {
      console.error('Error loading message history:', error);
    }
  };
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string>('');
  const [isAvatarPlaying, setIsAvatarPlaying] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);

  const addMessage = (content: string, messageType: string, isFromBot: boolean = false, audioBlob?: Blob, audioUrl?: string, videoUrl?: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      sender: isFromBot ? 'bot' : 'user',
      receiver: isFromBot ? 'user' : 'bot',
      content,
      message_type: messageType,
      timestamp: new Date().toISOString(),
      is_from_bot: isFromBot,
      audioBlob,
      audio_url: audioUrl,
      video_url: videoUrl
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-play audio responses from bot
    if (isFromBot && messageType === 'audio' && audioUrl) {
      setTimeout(() => {
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
          console.log('Auto-play blocked by browser:', error);
        });
      }, 500); // Small delay to ensure the message is rendered
    }
    
    // Handle video responses from bot
    if (isFromBot && messageType === 'video' && videoUrl) {
      setAvatarVideoUrl(videoUrl);
      setIsAvatarPlaying(true);
    }
  };

  const sendTextMessage = async () => {
    if (!textInput.trim() || isLoading) return;

    const messageText = textInput.trim();
    setTextInput('');
    setIsLoading(true);

    // Add user message to chat
    addMessage(messageText, 'text', false);

    try {
      const requestPayload: any = {
        type: 'text',
        sender: userId,
        receiver: 'bot',
        text: messageText,
        timestamp: new Date().toISOString(),
        messageId: `msg_${Date.now()}`
      };
      
      // Only add response_type if not default
      if (responseType !== 'default') {
        requestPayload.response_type = responseType;
      }
      
      await axios.post(`${API_BASE_URL}/agent-webhook/inprove`, requestPayload);

      // Messages are now handled via WebSocket in real-time
      setIsLoading(false);

    } catch (error) {
      console.error('Error sending text message:', error);
      addMessage("Sorry, I couldn't process your message. Please try again.", 'text', true);
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

              mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Audio = reader.result as string;
            const audioData = base64Audio.split(',')[1]; // Remove data URL prefix

            setIsLoading(true);

            // Add user audio message to chat with the audio blob
            addMessage("🎵 Audio Message", 'audio', false, audioBlob);

          try {
            await axios.post(`${API_BASE_URL}/agent-webhook/inprove`, {
              type: 'audio',
              sender: userId,
              receiver: 'bot',
              audio: audioData,
              timestamp: new Date().toISOString(),
              messageId: `msg_${Date.now()}`
            });

            // Messages are now handled via WebSocket in real-time
            setIsLoading(false);

          } catch (error) {
            console.error('Error sending audio message:', error);
            addMessage("Sorry, I couldn't process your audio message. Please try again.", 'text', true);
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Camera functionality
  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
      setCameraError('');
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Camera access denied. Please allow camera permissions.');
      setIsCameraOn(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    setCameraStream(prevStream => {
      if (prevStream) {
        prevStream.getTracks().forEach(track => track.stop());
      }
      return null;
    });
    setIsCameraOn(false);
  }, []);

  // Camera toggle function
  const toggleCamera = useCallback(async () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      try {
        await startCamera();
      } catch (error) {
        console.error('Error starting camera:', error);
        setCameraError('Camera access denied. Please allow camera permissions.');
      }
    }
  }, [isCameraOn, startCamera, stopCamera]);

  // Connect video element when stream changes
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      console.log('Connecting video element to stream');
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8080/ws/${userId}`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    websocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          const message = data.message;
          console.log('Adding bot message:', message);
          
          // Handle JSON content for audio/video responses
          let content = message.content;
          let audioUrl = message.audio_url;
          let videoUrl = message.video_url;
          
          // If content is JSON, try to parse it
          if (typeof content === 'string' && content.startsWith('{')) {
            try {
              const jsonContent = JSON.parse(content);
              if (jsonContent.url) {
                audioUrl = jsonContent.url;
                content = jsonContent.caption || "Audio response";
              }
            } catch (e) {
              console.log('Content is not JSON, using as-is');
            }
          }
          
          addMessage(
            content, 
            message.message_type, 
            true, 
            undefined, 
            audioUrl, 
            videoUrl
          );
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return () => {
      websocket.close();
    };
  }, [userId]);

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>Inprove Streaming Demo</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-id-label">User ID:</span>
            <span className="user-id-value">{userId}</span>
            <button 
              onClick={() => {
                const newUserId = 'web_user_' + Math.random().toString(36).substr(2, 9);
                setUserId(newUserId);
                setMessages([]); // Clear messages for new user
                // Load history for new user (will be empty initially)
                loadMessageHistory(newUserId);
              }}
              className="new-user-button"
              title="Generate new user ID"
            >
              🔄 New User
            </button>
          </div>
          <div className="response-type-selector">
            <label>
              Response Type:
              <select 
                value={responseType} 
                onChange={(e) => setResponseType(e.target.value as 'default' | 'text' | 'audio' | 'video')}
                className="response-type-select"
              >
                <option value="default">DEFAULT</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Left Section - Video Streams */}
        <div className="video-section">
          <div className="video-card">
            <h3>AI Avatar</h3>
            <div className="video-placeholder">
              {avatarVideoUrl && isAvatarPlaying ? (
                <video 
                  ref={avatarVideoRef}
                  src={avatarVideoUrl}
                  autoPlay={isAvatarPlaying}
                  playsInline 
                  className="avatar-video"
                  onEnded={() => setIsAvatarPlaying(false)}
                  onPlay={() => setIsAvatarPlaying(true)}
                  onPause={() => setIsAvatarPlaying(false)}
                />
              ) : (
                <div className="avatar-placeholder">
                  <img 
                    src="/avatar.png" 
                    alt="AI Avatar" 
                    className="avatar-image"
                  />
                  <p>AI Avatar</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="video-card">
            <h3>Your Camera</h3>
            <div className="camera-controls">
              <button 
                onClick={toggleCamera}
                className={`camera-toggle-button ${isCameraOn ? 'on' : 'off'}`}
                disabled={isLoading}
              >
                {isCameraOn ? '📷 Turn Off Camera' : '📷 Turn On Camera'}
              </button>
            </div>
            <div className="video-placeholder">
              {isCameraOn && cameraStream ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="camera-feed"
                />
              ) : (
                <div className="video-feed">
                  {cameraError ? (
                    <div className="camera-error">
                      <span>📷</span>
                      <p>{cameraError}</p>
                      <button onClick={toggleCamera} className="retry-button">
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="capybara-placeholder">
                      <img 
                        src="/image.png" 
                        alt="Capybara" 
                        className="capybara-image"
                      />
                      <p>Camera is off</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Chat Messages */}
        <div className="chat-section">
          <div className="chat-card">
            <h3>Chat Messages</h3>
            <div className="messages-container">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.is_from_bot ? 'bot' : 'user'}`}
                >
                  <div className="message-content">
                    {message.message_type === 'audio' && (
                      <div className="audio-message">
                        <span className="audio-icon">🎵</span>
                        {message.audioBlob && (
                          <audio controls className="audio-player">
                            <source src={URL.createObjectURL(message.audioBlob)} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        {message.audio_url && (
                          <audio controls className="audio-player">
                            <source src={message.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        <span className="audio-text">
                          {message.content === "Audio response" ? "🎵 Bot Audio Response" : message.content}
                        </span>
                      </div>
                    )}
                    {message.message_type === 'video' && (
                      <div className="video-message">
                        <span className="video-icon">🎬</span>
                        {message.video_url && (
                          <button 
                            onClick={() => {
                              setAvatarVideoUrl(message.video_url!);
                              setIsAvatarPlaying(true);
                              if (avatarVideoRef.current) {
                                avatarVideoRef.current.play();
                              }
                            }}
                            className="play-avatar-button"
                            disabled={isAvatarPlaying}
                          >
                            ▶️ Play Avatar
                          </button>
                        )}
                        <span className="video-text">{message.content}</span>
                      </div>
                    )}
                    {message.message_type !== 'audio' && message.message_type !== 'video' && (
                      <>
                        {message.content}
                      </>
                    )}
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot">
                  <div className="message-content">
                    <span className="loading-indicator">...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="input-section">
              <div className="input-buttons">
                <button 
                  className={`record-button ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  🎤 {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
              <div className="text-input-container">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Type your message..."
                  className="text-input"
                  disabled={isLoading}
                />
                <button 
                  onClick={sendTextMessage} 
                  className="send-button"
                  disabled={isLoading || !textInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Status */}
      <div className="status-section">
        <div className="status-card">
          <h3>Status</h3>
          <div className="status-items">
            <div className="status-item">
              <span>API Status:</span>
              <span className="status-value connected">
                {isLoading ? 'Processing...' : 'Ready'}
              </span>
            </div>
            <div className="status-item">
              <span>Messages:</span>
              <span className="status-value">
                {messages.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
