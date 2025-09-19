import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Permission } from '@/types/permissions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions?: Permission[];
    requireAll?: boolean;
    fallbackPath?: string;
}

export function ProtectedRoute({
    children,
    requiredPermissions = [],
    requireAll = false,
    fallbackPath = '/login',
}: ProtectedRouteProps) {
    const {
        isAuthenticated,
        isLoading,
        isHydrated,     // ✅ added from store
        hasAnyPermission,
        hasAllPermissions,
    } = useAuthStore();
    const location = useLocation();


    // ✅ NEW: wait for hydration before deciding anything
    if (!isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Show loading state while requests (login, logout, profile fetch) are in progress
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate to={fallbackPath} state={{ from: location }} replace />
        );
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAll
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions) {
            console.log('ProtectedRoute: Missing required permissions');
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}
