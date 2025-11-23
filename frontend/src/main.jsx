import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

// Replace with your actual Google Client ID from Google Cloud Console
// Get it from: https://console.cloud.google.com/apis/credentials
// This MUST match the Client ID in backend/application.properties
const GOOGLE_CLIENT_ID = '872820810176-2ptp088i0i981rtinaklu0qerafcbr2s.apps.googleusercontent.com';

if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.error('⚠️ GOOGLE CLIENT ID NOT CONFIGURED! Please update main.jsx with your Google Client ID from Google Cloud Console.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
