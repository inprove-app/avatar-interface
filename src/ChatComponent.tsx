import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChatComponentProps, Message } from './types';
import './ChatComponent.css';

export const ChatComponent: React.FC<ChatComponentProps> = ({
  apiUrl,
  apiKey,
  userId: propUserId,
  theme = 'light',
  height = '400px',
  width = '100%',
  
  // Layout mode
  compactMode = true, // Default to compact mode
  
  // Feature toggles
  enableText = true,
  enableAudio = true,
  enableVideo = true,
  enableAvatar = true,
  enableCamera = true,
  
  // Response type selection
  responseType: propResponseType = 'default',
  enableResponseTypeSelector = true,
  
  // Callbacks
  onMessage,
  onError,
  onAvatarVideoPlay,
  
  // Styling
  className = '',
  style = {}
}) => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [responseType, setResponseType] = useState<'default' | 'text' | 'audio' | 'video'>(propResponseType);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Camera state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Avatar video state
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string>('');
  const [isAvatarPlaying, setIsAvatarPlaying] = useState<boolean>(false);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  
  // Modal state for compact mode avatar videos
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>('');

  // Generate user ID if not provided
  const getUserId = () => {
    if (propUserId) return propUserId;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || 'web_user_' + Math.random().toString(36).substr(2, 9);
  };

  const [userId] = useState(getUserId());

  // Domain validation
  const validateDomain = useCallback(() => {
    const allowedDomains = [
      'inproveapp.com',
      'localhost',
      '127.0.0.1'
    ];
    const currentDomain = window.location.hostname;
    const isValid = allowedDomains.some(domain => 
      currentDomain.includes(domain)
    );
    
    if (!isValid) {
      const errorMsg = `Domain ${currentDomain} is not authorized to use this component`;
      onError?.(errorMsg);
      console.error(errorMsg);
    }
    
    return isValid;
  }, [onError]);

  // Load message history
  const loadMessageHistory = useCallback(async (user: string) => {
    if (!validateDomain()) return;
    
    try {
      const response = await axios.get(`${apiUrl}/messages/${user}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
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
      onError?.('Failed to load message history');
    }
  }, [apiUrl, apiKey, validateDomain, onError]);

  // Add message helper
  const addMessage = useCallback((content: string, messageType: string, isFromBot: boolean = false, audioBlob?: Blob, audioUrl?: string, videoUrl?: string) => {
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
    onMessage?.(newMessage);
    
    // Auto-play audio responses from bot
    if (isFromBot && messageType === 'audio' && audioUrl) {
      setTimeout(() => {
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
          console.log('Auto-play blocked by browser:', error);
        });
      }, 500);
    }
    
    // Handle video responses from bot
    if (isFromBot && messageType === 'video' && videoUrl) {
      if (compactMode && enableAvatar) {
        // In compact mode with avatar enabled, show modal
        setModalVideoUrl(videoUrl);
        setShowAvatarModal(true);
      } else {
        // In full mode or when avatar disabled, use normal flow
        setAvatarVideoUrl(videoUrl);
        setIsAvatarPlaying(true);
        onAvatarVideoPlay?.(videoUrl);
      }
    }
  }, [onMessage, onAvatarVideoPlay, compactMode, enableAvatar]);

  // Send text message
  const sendTextMessage = useCallback(async () => {
    if (!textInput.trim() || isLoading || !validateDomain()) return;

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
      
      await axios.post(`${apiUrl}/agent-webhook/inprove`, requestPayload, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error sending text message:', error);
      addMessage("Sorry, I couldn't process your message. Please try again.", 'text', true);
      setIsLoading(false);
      onError?.('Failed to send message');
    }
  }, [textInput, isLoading, validateDomain, userId, apiUrl, apiKey, responseType, addMessage, onError]);

  // Audio recording functions
  const startRecording = useCallback(async () => {
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
            const requestPayload: any = {
              type: 'audio',
              sender: userId,
              receiver: 'bot',
              audio: audioData,
              timestamp: new Date().toISOString(),
              messageId: `msg_${Date.now()}`
            };
            
            // Only add response_type if not default
            if (responseType !== 'default') {
              requestPayload.response_type = responseType;
            }
            
            await axios.post(`${apiUrl}/agent-webhook/inprove`, requestPayload, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });

            setIsLoading(false);
          } catch (error) {
            console.error('Error sending audio message:', error);
            addMessage("Sorry, I couldn't process your audio message. Please try again.", 'text', true);
            setIsLoading(false);
            onError?.('Failed to send audio message');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError?.('Failed to start recording');
    }
  }, [userId, apiUrl, apiKey, responseType, addMessage, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  // Camera functions
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
      onError?.('Failed to access camera');
    }
  }, [onError]);

  const stopCamera = useCallback(() => {
    setCameraStream(prevStream => {
      if (prevStream) {
        prevStream.getTracks().forEach(track => track.stop());
      }
      return null;
    });
    setIsCameraOn(false);
  }, []);

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

  // Format time helper
  const formatTime = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  }, []);

  // Load message history when component mounts
  useEffect(() => {
    loadMessageHistory(userId);
  }, [userId, loadMessageHistory]);

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
    if (!validateDomain()) return;

    const wsUrl = apiUrl.replace('http', 'ws');
    const websocket = new WebSocket(`${wsUrl}/ws/${userId}`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
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
      setConnectionStatus('disconnected');
      onError?.('WebSocket connection error');
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    };
    
    return () => {
      websocket.close();
    };
  }, [userId, apiUrl, validateDomain, addMessage, onError]);

  // Validate domain on mount
  useEffect(() => {
    validateDomain();
  }, [validateDomain]);

  // Compact mode - just the chat interface
  if (compactMode) {
    return (
      <>
        <div 
          className={`inprove-chat-component ${theme} ${className}`}
          style={{ height, width, ...style }}
        >
          {/* Header */}
          <div className="chat-header">
            <h3>Chat</h3>
            <div className="connection-status">
              <span className={`status-indicator ${connectionStatus}`}>
                {connectionStatus === 'connected' ? '🟢' : '🔴'}
              </span>
              <span className="status-text">{connectionStatus}</span>
            </div>
            {enableResponseTypeSelector && (
              <div className="response-type-selector">
                <label>
                  Response:
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
            )}
          </div>

          {/* Messages Container */}
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
                            if (compactMode && enableAvatar) {
                              // Show modal in compact mode
                              setModalVideoUrl(message.video_url!);
                              setShowAvatarModal(true);
                            } else {
                              // Normal flow for full mode
                              setAvatarVideoUrl(message.video_url!);
                              setIsAvatarPlaying(true);
                              onAvatarVideoPlay?.(message.video_url!);
                              if (avatarVideoRef.current) {
                                avatarVideoRef.current.play();
                              }
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
          
          {/* Input Section */}
          <div className="input-section">
            {/* Audio Recording Button */}
            {enableAudio && (
              <div className="input-buttons">
                <button 
                  className={`record-button ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  🎤 {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            )}
            
            {/* Camera Toggle Button */}
            {enableCamera && (
              <div className="camera-controls">
                <button 
                  onClick={toggleCamera}
                  className={`camera-toggle-button ${isCameraOn ? 'on' : 'off'}`}
                  disabled={isLoading}
                >
                  {isCameraOn ? '📷 Turn Off Camera' : '📷 Turn On Camera'}
                </button>
              </div>
            )}
            
            {/* Text Input */}
            {enableText && (
              <div className="text-input-container">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Type your message..."
                  className="text-input"
                  disabled={isLoading || connectionStatus !== 'connected'}
                />
                <button 
                  onClick={sendTextMessage} 
                  className="send-button"
                  disabled={isLoading || !textInput.trim() || connectionStatus !== 'connected'}
                >
                  Send
                </button>
              </div>
            )}
            
            {/* Camera Feed */}
            {enableCamera && isCameraOn && cameraStream && (
              <div className="camera-feed-container">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="camera-feed"
                />
              </div>
            )}
            
            {/* Camera Error */}
            {enableCamera && cameraError && (
              <div className="camera-error">
                <span>📷</span>
                <p>{cameraError}</p>
                <button onClick={toggleCamera} className="retry-button">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Video Modal for Compact Mode */}
        {showAvatarModal && (
          <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
            <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="avatar-modal-header">
                <h3>AI Avatar</h3>
                <button 
                  className="modal-close-button"
                  onClick={() => setShowAvatarModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="avatar-modal-video">
                <video 
                  src={modalVideoUrl}
                  autoPlay
                  controls
                  className="modal-video"
                  onEnded={() => setShowAvatarModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full mode - with avatar and camera cards
  return (
    <div 
      className={`inprove-chat-component-full ${theme} ${className}`}
      style={{ height, width, ...style }}
    >
      <div className="full-layout">
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
                              onAvatarVideoPlay?.(message.video_url!);
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
    </div>
  );
}; 