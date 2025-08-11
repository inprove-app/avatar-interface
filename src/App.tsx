import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import ChatComponent from './ChatComponent';

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



function App() {
  const [messages, setMessages] = useState<Message[]>([]);
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


  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string>('');
  const [isAvatarPlaying, setIsAvatarPlaying] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);





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
        <ChatComponent
          userId={userId}
          responseType={responseType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          messages={messages}
          setMessages={setMessages}
          setAvatarVideoUrl={setAvatarVideoUrl}
          setIsAvatarPlaying={setIsAvatarPlaying}
          avatarVideoRef={avatarVideoRef}
        />
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
