import { useAuth } from './useAuth';
import { DEV_CONFIG } from '@/config/dev';

export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  
  // In development mode, always return true for all permission checks
  if (DEV_CONFIG.BYPASS_PERMISSIONS) {
    return {
      hasPermission: () => true,
      hasAnyPermission: () => true,
      hasAllPermissions: () => true
    };
  }
  
  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
