import { Permission } from "@/types/permissions"; 
import React from "react";
import { PermissionGate } from "./PermissionGate";

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
    Component: React.ComponentType<P>,
    permissions: Permission[],
    requireAll: boolean = false,
    fallback?: React.ReactNode
) {
    return function PermissionWrappedComponent(props: P) {
        return (
            <PermissionGate
                permissions={permissions}
                requireAll={requireAll}
                fallback={fallback}
            >
                <Component {...props} />
            </PermissionGate>
        );
    };
}

