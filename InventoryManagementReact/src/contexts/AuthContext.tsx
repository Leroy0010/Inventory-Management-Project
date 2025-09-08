import React, { createContext, useReducer, useEffect } from 'react';
import type { User, Permission, AuthState } from '@/types';
import { UserRole } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/permissions';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/auth-utils';
import { DEV_CONFIG } from '@/config/dev';

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        user: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        permissions: ROLE_PERMISSIONS[action.payload.role] || []
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        permissions: []
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        permissions: []
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

// Use development configuration
const DEV_MODE = DEV_CONFIG.BYPASS_AUTH;

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: []
};

// Auth Context
interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  loginWithGoogle: (googleUser: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (DEV_MODE) {
          // Development mode - automatically log in as admin with all permissions
          const mockUser: User = {
            ...DEV_CONFIG.DEFAULT_USER,
            role: DEV_CONFIG.DEFAULT_USER.role as UserRole
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
          return;
        }

        const token = localStorage.getItem('auth_token');
        if (token) {
          // TODO: Implement token validation with backend
          // For now, we'll simulate a user
          const mockUser: User = {
            id: '1',
            email: 'admin@inventory.com',
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.ADMIN,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (DEV_MODE) {
        // Development mode - instant login
        const mockUser: User = {
          ...DEV_CONFIG.DEFAULT_USER,
          email, // Use the provided email
          role: DEV_CONFIG.DEFAULT_USER.role as UserRole
        };
        
        localStorage.setItem('auth_token', 'mock_token');
        dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        return;
      }

      // TODO: Implement actual login API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const loginWithGoogle = async (googleUser: any) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (DEV_MODE) {
        // Development mode - instant Google login
        const mockUser: User = {
          id: googleUser.id || 'google-user-1',
          email: googleUser.email,
          firstName: googleUser.firstName || 'Google',
          lastName: googleUser.lastName || 'User',
          role: UserRole.ADMIN, // Default to ADMIN for development
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('auth_token', 'google_mock_token');
        dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        return;
      }

      // TODO: Implement actual Google OAuth API call
      // This would typically involve:
      // 1. Sending the Google OAuth code to your backend
      // 2. Backend verifies the code with Google
      // 3. Backend returns user info and JWT token
      
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: googleUser.id || 'google-user-1',
        email: googleUser.email,
        firstName: googleUser.firstName || 'Google',
        lastName: googleUser.lastName || 'User',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('auth_token', 'google_mock_token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      console.error('Google login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(state.permissions, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(state.permissions, permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(state.permissions, permissions);
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    updateUser,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

