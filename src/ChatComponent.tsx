import React, { useState, useRef, useEffect } from 'react';
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

interface ChatComponentProps {
  userId: string;
  responseType: 'default' | 'text' | 'audio' | 'video';
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setAvatarVideoUrl: (url: string) => void;
  setIsAvatarPlaying: (playing: boolean) => void;
  avatarVideoRef: React.RefObject<HTMLVideoElement | null>;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';

const ChatComponent: React.FC<ChatComponentProps> = ({
  userId,
  responseType,
  isLoading,
  setIsLoading,
  messages,
  setMessages,
  setAvatarVideoUrl,
  setIsAvatarPlaying,
  avatarVideoRef
}) => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    
    setMessages((prev: Message[]) => [...prev, newMessage]);
    
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
            
            await axios.post(`${API_BASE_URL}/agent-webhook/inprove`, requestPayload);

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

  // WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket(`${WS_BASE_URL}/ws/${userId}`);
    
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
                        disabled={false}
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
  );
};

export default ChatComponent;
