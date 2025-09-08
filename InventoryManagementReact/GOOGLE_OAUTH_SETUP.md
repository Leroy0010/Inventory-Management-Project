# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the Inventory Management React application.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud Project
3. Google OAuth 2.0 credentials

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 2. Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Inventory Management System"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `openid`
   - `profile`
   - `email`
5. Add test users (for development)

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
5. Copy the Client ID

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Development Configuration
VITE_DEV_MODE=true
VITE_BYPASS_AUTH=true
VITE_BYPASS_PERMISSIONS=true
```

### 5. Update Google OAuth Configuration

Edit `src/config/google-oauth.ts` and replace the placeholder client ID:

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-actual-client-id.apps.googleusercontent.com',
  // ... rest of config
};
```

## Development Mode

The application includes a development mode that bypasses actual Google OAuth for easier testing:

- **Development Mode**: Uses mock Google user data
- **Production Mode**: Uses actual Google OAuth flow

To toggle between modes, edit `src/config/google-oauth.ts`:

```typescript
export const DEV_GOOGLE_OAUTH = {
  enabled: true, // Set to false for production
  mockUser: {
    id: 'google-123456789',
    email: 'user@gmail.com',
    firstName: 'Google',
    lastName: 'User',
    avatar: 'https://via.placeholder.com/150',
    verified: true
  }
};
```

## Testing

### Development Mode Testing

1. Start the development server: `npm run dev`
2. Go to the login page
3. Click "Continue with Google"
4. You'll be automatically logged in with mock Google user data

### Production Mode Testing

1. Set `DEV_GOOGLE_OAUTH.enabled = false`
2. Ensure you have a valid Google OAuth Client ID
3. Start the development server: `npm run dev`
4. Go to the login page
5. Click "Continue with Google"
6. You'll be redirected to Google's OAuth consent screen
7. After authorization, you'll be redirected back to the app

## Backend Integration

For production, you'll need to integrate with your Spring Boot backend:

1. **Frontend**: Sends Google OAuth code to backend
2. **Backend**: Verifies code with Google and returns JWT token
3. **Frontend**: Stores JWT token and logs user in

### Backend Endpoint

The backend should have an endpoint like:

```java
@PostMapping("/api/auth/google")
public ResponseEntity<?> googleAuth(@RequestBody GoogleAuthRequest request) {
    // Verify Google OAuth code
    // Create or find user
    // Generate JWT token
    // Return user info and token
}
```

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Check your Client ID
2. **"Redirect URI mismatch"**: Ensure redirect URI matches exactly
3. **"Access blocked"**: Check OAuth consent screen configuration
4. **CORS errors**: Ensure your domain is authorized

### Debug Mode

Enable debug logging by adding to your browser console:

```javascript
localStorage.setItem('debug', 'google-oauth');
```

## Security Considerations

1. **Never commit Client ID to version control**
2. **Use environment variables for sensitive data**
3. **Validate OAuth responses on the backend**
4. **Implement proper error handling**
5. **Use HTTPS in production**

## Production Checklist

- [ ] Set `DEV_GOOGLE_OAUTH.enabled = false`
- [ ] Configure production redirect URIs
- [ ] Set up proper environment variables
- [ ] Test OAuth flow end-to-end
- [ ] Implement backend verification
- [ ] Set up proper error handling
- [ ] Configure CORS properly
- [ ] Use HTTPS

This setup provides a secure and user-friendly Google OAuth integration for your inventory management system.
