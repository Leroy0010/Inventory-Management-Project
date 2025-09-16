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
    const { isAuthenticated, isLoading, hasAnyPermission, hasAllPermissions } =
        useAuthStore();
    const location = useLocation();

    // Show loading state while checking authentication
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
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
    Component: React.ComponentType<P>,
    requiredPermissions: Permission[],
    requireAll: boolean = false
) {
    return function PermissionWrappedComponent(props: P) {
        const { hasAnyPermission, hasAllPermissions } = useAuthStore();

        const hasRequiredPermissions = requireAll
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions) {
            return null;
        }

        return <Component {...props} />;
    };
}
