import React from 'react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Lock, 
    Eye, 
    EyeOff, 
    Shield, 
    User, 
    Settings, 
    AlertTriangle,
    Info
} from 'lucide-react';
import type { Permission } from '@/types/permissions';

interface PermissionBasedUIProps {
    children: React.ReactNode;
    permissions: Permission[];
    requireAll?: boolean;
    fallbackComponent?: React.ReactNode;
    showPermissionHint?: boolean;
    className?: string;
}

export function PermissionBasedUI({
    children,
    permissions,
    requireAll = false,
    fallbackComponent,
    showPermissionHint = true,
    className
}: PermissionBasedUIProps) {
    const { canAccess } = usePermissionCheck();
    const { user } = useAuthStore();

    const hasAccess = canAccess(permissions, requireAll);

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallbackComponent) {
        return <>{fallbackComponent}</>;
    }

    if (!showPermissionHint) {
        return null;
    }

    const getPermissionLevel = () => {
        if (!user?.role) return 'unknown';
        
        switch (user.role.name) {
            case 'ADMIN':
                return 'admin';
            case 'STOREKEEPER':
                return 'storekeeper';
            case 'STAFF':
                return 'staff';
            default:
                return 'unknown';
        }
    };

    const getPermissionMessage = () => {
        const level = getPermissionLevel();
        const permissionNames = permissions.join(', ');
        
        return {
            title: 'Access Restricted',
            message: `This feature requires ${permissionNames} permission(s). Your current role (${user?.role?.name}) doesn't have access to this content.`,
            suggestion: level === 'staff' 
                ? 'Contact your storekeeper for access to this feature.'
                : level === 'storekeeper'
                ? 'Contact your administrator for additional permissions.'
                : 'Please contact your system administrator.'
        };
    };

    const { title, message, suggestion } = getPermissionMessage();

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    {title}
                    <Badge variant="outline" className="ml-auto">
                        {user?.role?.name || 'Unknown'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{message}</p>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            <Info className="h-3 w-3 inline mr-1" />
                            {suggestion}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        Required permissions: {permissions.join(', ')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

// Component for showing different UI states based on permissions
export function ConditionalUI({
    children,
    fallback,
    permissions,
    requireAll = false,
    showWhenNoAccess = false
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    permissions: Permission[];
    requireAll?: boolean;
    showWhenNoAccess?: boolean;
}) {
    const { canAccess } = usePermissionCheck();
    const hasAccess = canAccess(permissions, requireAll);

    if (hasAccess) {
        return <>{children}</>;
    }

    if (showWhenNoAccess) {
        return <>{fallback}</>;
    }

    return null;
}

// Hook for permission-based conditional rendering
export function usePermissionUI(permissions: Permission[], requireAll: boolean = false) {
    const { canAccess } = usePermissionCheck();
    const { user } = useAuthStore();

    return {
        hasAccess: canAccess(permissions, requireAll),
        userRole: user?.role?.name,
        canShow: canAccess(permissions, requireAll),
        isAdmin: user?.role?.name === 'ADMIN',
        isStorekeeper: user?.role?.name === 'STOREKEEPER',
        isStaff: user?.role?.name === 'STAFF'
    };
}
