import { DEV_CONFIG } from './dev';

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  // Google OAuth Client ID
  // Replace with your actual Google OAuth Client ID
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
  
  // OAuth Scopes
  scopes: [
    'openid',
    'profile',
    'email'
  ],
  
  // Redirect URI (should match your Google OAuth configuration)
  redirectUri: window.location.origin,
  
  // Response type
  responseType: 'code',
  
  // Additional parameters
  additionalParams: {
    prompt: 'select_account',
    access_type: 'offline'
  }
};

// Google OAuth Helper Functions
export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
    ...GOOGLE_OAUTH_CONFIG.additionalParams
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Parse OAuth response from URL
export const parseOAuthResponse = (url: string) => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  
  const code = params.get('code');
  const error = params.get('error');
  const state = params.get('state');
  
  return { code, error, state }; 
};

// Development mode - mock Google OAuth
export const DEV_GOOGLE_OAUTH = {
  enabled: DEV_CONFIG.GOOGLE_OAUTH_DEV_MODE, // Use dev config
  mockUser: {
    id: 'google-123456789',
    email: 'user@gmail.com',
    firstName: 'Google',
    lastName: 'User',
    avatar: 'https://via.placeholder.com/150',
    verified: true
  }
};
