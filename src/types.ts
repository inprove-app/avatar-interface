export interface Message {
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

export interface ChatComponentProps {
  apiUrl: string;
  apiKey: string;
  userId?: string;
  theme?: 'light' | 'dark';
  height?: string;
  width?: string;
  
  // Layout mode
  compactMode?: boolean; // If false, shows avatar and camera cards
  
  // Feature toggles
  enableText?: boolean;
  enableAudio?: boolean;
  enableVideo?: boolean;
  enableAvatar?: boolean;
  enableCamera?: boolean;
  
  // Response type selection
  responseType?: 'default' | 'text' | 'audio' | 'video';
  enableResponseTypeSelector?: boolean;
  
  // Callbacks
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
  onAvatarVideoPlay?: (videoUrl: string) => void;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
} 