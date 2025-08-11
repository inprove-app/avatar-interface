import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ChatPage from './ChatPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Check if we should render the embedded chat page
const urlParams = new URLSearchParams(window.location.search);
const isEmbeddedChat = urlParams.get('embedded') === 'true' || window.location.pathname.includes('chat');

root.render(
  <React.StrictMode>
    {isEmbeddedChat ? <ChatPage /> : <App />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
