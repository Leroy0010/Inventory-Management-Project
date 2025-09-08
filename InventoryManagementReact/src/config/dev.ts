// Development Configuration
// Set to false when ready for production

export const DEV_CONFIG = {
  // Bypass authentication - automatically log in as admin
  BYPASS_AUTH: true,
  
  // Bypass permission checks - allow access to all pages
  BYPASS_PERMISSIONS: true,
  
  // Show development warnings in console
  SHOW_DEV_WARNINGS: true,
  
  // Mock API delays (in milliseconds)
  MOCK_API_DELAY: 0,
  
  // Google OAuth development mode
  GOOGLE_OAUTH_DEV_MODE: true,
  
  // Theme testing mode
  ENABLE_THEME_TESTING: true,
  
  // Default user for development
  DEFAULT_USER: {
    id: '1',
    email: 'admin@inventory.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN' as const,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Development mode warning
if (DEV_CONFIG.BYPASS_AUTH && DEV_CONFIG.SHOW_DEV_WARNINGS) {
  console.warn('🚧 DEVELOPMENT MODE ENABLED 🚧');
  console.warn('Authentication and permission checks are bypassed');
  console.warn('NotificationProvider is disabled');
  console.warn('Set DEV_CONFIG.BYPASS_AUTH to false for production');
}
