# 🔐 Token Management Guide

## Overview

This guide explains how to use the token management system implemented in the auth store. The system supports both HTTP-only cookies (recommended) and client-side token storage.

## 🏗️ Architecture

### Auth Store Token Management

The `useAuthStore` now includes token management methods:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  token: string | null;           // JWT access token
  refreshToken: string | null;    // Refresh token
}

interface AuthActions {
  // Token management
  setTokens: (token: string, refreshToken: string) => void;
  clearTokens: () => void;
  
  // User management
  setUser: (user: User | null) => void;
  clearUser: () => void;
}
```

## 🚀 Usage Examples

### 1. Basic Token Management

```typescript
import { useAuthStore } from '@/stores/authStore';

function MyComponent() {
  const { token, refreshToken, setTokens, clearTokens } = useAuthStore();
  
  // Check if user has tokens
  const hasTokens = !!(token && refreshToken);
  
  // Set tokens after successful login
  const handleLogin = async (credentials) => {
    const response = await login(credentials);
    setTokens(response.token, response.refreshToken);
  };
  
  // Clear tokens on logout
  const handleLogout = () => {
    clearTokens();
  };
}
```

### 2. Using the Token Hook

```typescript
import { useAuthTokens } from '@/hooks/useAuthTokens';

function ApiComponent() {
  const { 
    token, 
    hasTokens, 
    getAuthHeader, 
    isTokenExpired 
  } = useAuthTokens();
  
  // Get authorization header for API calls
  const authHeader = getAuthHeader(); // "Bearer <token>" or null
  
  // Check if token is expired
  const isExpired = isTokenExpired(token);
  
  // Make authenticated API call
  const makeApiCall = async () => {
    if (!hasTokens || isExpired) {
      throw new Error('No valid token available');
    }
    
    const response = await fetch('/api/protected', {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    return response.json();
  };
}
```

### 3. Integration with TanStack Query

```typescript
import { useAuthTokens } from '@/hooks/useAuthTokens';
import { useQuery } from '@tanstack/react-query';

function useProtectedData() {
  const { hasTokens, getAuthHeader } = useAuthTokens();
  
  return useQuery({
    queryKey: ['protected-data'],
    queryFn: async () => {
      if (!hasTokens) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('/api/protected-data', {
        headers: {
          'Authorization': getAuthHeader(),
        },
      });
      
      return response.json();
    },
    enabled: hasTokens, // Only run query if user has tokens
  });
}
```

### 4. Token Refresh Implementation

```typescript
import { useAuthTokens } from '@/hooks/useAuthTokens';
import { useAuthQueries } from '@/hooks/queries/useAuth';

function useTokenRefresh() {
  const { token, isTokenExpired } = useAuthTokens();
  const { refreshMutation } = useAuthQueries();
  
  const refreshIfNeeded = async () => {
    if (token && isTokenExpired(token)) {
      try {
        await refreshMutation.mutateAsync();
      } catch (error) {
        // Handle refresh failure
        console.error('Token refresh failed:', error);
      }
    }
  };
  
  return { refreshIfNeeded };
}
```

## 🔄 Two Implementation Approaches

### Approach 1: HTTP-Only Cookies (Recommended)

This is the current implementation where tokens are stored in HTTP-only cookies:

```typescript
// In useAuth hook
const loginMutation = useMutation({
  mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
  onSuccess: (data) => {
    setUser(data.user);
    // Tokens are automatically handled by HTTP-only cookies
    // No need to call setTokens()
    clearError();
  },
});
```

**Benefits:**
- ✅ More secure (tokens not accessible via JavaScript)
- ✅ Automatic inclusion in requests
- ✅ Protection against XSS attacks
- ✅ Simpler implementation

### Approach 2: Client-Side Token Storage

If you need client-side access to tokens:

```typescript
// In useAuth hook
const loginMutation = useMutation({
  mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
  onSuccess: (data) => {
    setUser(data.user);
    // Store tokens in state for client-side access
    setTokens(data.token, data.refreshToken);
    clearError();
  },
});
```

**Benefits:**
- ✅ Client-side access to tokens
- ✅ More control over token management
- ✅ Can implement custom token refresh logic

## 🛠️ API Integration

### Axios Interceptor Example

```typescript
// In api/client.ts
import { useAuthTokens } from '@/hooks/useAuthTokens';

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const { getAuthHeader } = useAuthTokens();
  const authHeader = getAuthHeader();
  
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { refreshMutation } = useAuthQueries();
      
      try {
        await refreshMutation.mutateAsync();
        // Retry original request
        return apiClient(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

## 🔒 Security Considerations

### HTTP-Only Cookies (Current Implementation)
- ✅ Tokens are not accessible via JavaScript
- ✅ Automatic inclusion in requests
- ✅ Protection against XSS attacks
- ✅ CSRF protection with SameSite attribute

### Client-Side Storage (Alternative)
- ⚠️ Tokens accessible via JavaScript
- ⚠️ Vulnerable to XSS attacks
- ✅ More control over token lifecycle
- ✅ Can implement custom refresh logic

## 📝 Best Practices

### 1. Token Storage
```typescript
// Good: Use HTTP-only cookies when possible
// Tokens are automatically handled by the browser

// Alternative: Store in state only when needed
setTokens(token, refreshToken);
```

### 2. Token Validation
```typescript
// Always validate tokens before use
const { isTokenExpired, hasTokens } = useAuthTokens();

if (!hasTokens || isTokenExpired(token)) {
  // Handle invalid/expired token
  redirectToLogin();
}
```

### 3. Error Handling
```typescript
// Handle token-related errors gracefully
try {
  await makeAuthenticatedRequest();
} catch (error) {
  if (error.status === 401) {
    // Token expired or invalid
    clearTokens();
    redirectToLogin();
  }
}
```

### 4. Cleanup
```typescript
// Always clear tokens on logout
const handleLogout = () => {
  clearTokens();
  clearUser();
  // Clear any cached data
  queryClient.clear();
};
```

## 🧪 Testing

### Mock Token Management
```typescript
// In tests
import { useAuthStore } from '@/stores/authStore';

const mockTokens = {
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
};

// Set up test with tokens
beforeEach(() => {
  useAuthStore.getState().setTokens(mockTokens.token, mockTokens.refreshToken);
});

// Test token-dependent functionality
test('should make authenticated request with token', async () => {
  const { getAuthHeader } = useAuthTokens();
  expect(getAuthHeader()).toBe('Bearer mock-jwt-token');
});
```

This token management system provides a flexible and secure way to handle authentication tokens in your React application, supporting both HTTP-only cookies and client-side storage as needed.
