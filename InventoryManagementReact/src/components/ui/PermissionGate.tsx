import React from 'react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Permission } from '@/types/permissions';

interface PermissionGateProps {
    children: React.ReactNode;
    permissions: Permission[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
    showUnauthorizedMessage?: boolean;
    unauthorizedMessage?: string;
    redirectTo?: string;
    className?: string;
}

export function PermissionGate({
    children,
    permissions,
    requireAll = false,
    fallback = null,
    showUnauthorizedMessage = true,
    unauthorizedMessage = "You don't have permission to access this content.",
    redirectTo,
    className
}: PermissionGateProps) {
    const { canAccess } = usePermissionCheck();
    const navigate = useNavigate();

    const hasAccess = canAccess(permissions, requireAll);

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (!showUnauthorizedMessage) {
        return null;
    }

    const handleRedirect = () => {
        if (redirectTo) {
            navigate(redirectTo);
        } else {
            navigate('/unauthorized');
        }
    };

    return (
        <Card className={className}>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4">
                    <Lock className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                <p className="text-muted-foreground mb-4">{unauthorizedMessage}</p>
                <Button onClick={handleRedirect} variant="outline">
                    Go Back
                </Button>
            </CardContent>
        </Card>
    );
}

