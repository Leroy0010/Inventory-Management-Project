import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Package,
    Building,
    Layers,
    FileText,
    ShoppingCart,
    Bell,
    MessageSquare,
    BarChart3,
    Settings,
    User,
    Plus,
    Eye,
    Edit
} from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    permissions: string[];
    badge?: string;
    variant?: 'default' | 'secondary' | 'outline';
}

const quickActionsByRole: Record<string, QuickAction[]> = {
    ADMIN: [
        {
            id: 'add-storekeeper',
            label: 'Add Storekeeper',
            description: 'Create new storekeeper account',
            icon: Users,
            href: '/storekeeper/add',
            permissions: ['ADD_STOREKEEPER'],
            variant: 'default'
        },
        {
            id: 'manage-departments',
            label: 'Manage Departments',
            description: 'View and manage departments',
            icon: Building,
            href: '/departments',
            permissions: ['VIEW_DEPARTMENTS'],
            variant: 'secondary'
        },
        {
            id: 'send-notification',
            label: 'Send Notification',
            description: 'Send system-wide notifications',
            icon: Bell,
            href: '/send-message',
            permissions: ['SEND_GENERAL_NOTIFICATION'],
            variant: 'outline'
        },
        {
            id: 'view-settings',
            label: 'System Settings',
            description: 'Configure system settings',
            icon: Settings,
            href: '/settings',
            permissions: ['VIEW_SETTINGS'],
            variant: 'outline'
        }
    ],
    STOREKEEPER: [
        {
            id: 'add-inventory',
            label: 'Add Inventory',
            description: 'Add new inventory item',
            icon: Package,
            href: '/inventory/add',
            permissions: ['ADD_INVENTORY'],
            variant: 'default'
        },
        {
            id: 'add-staff',
            label: 'Add Staff',
            description: 'Add new staff member',
            icon: Users,
            href: '/staff/add',
            permissions: ['ADD_STAFF'],
            variant: 'default'
        },
        {
            id: 'manage-requests',
            label: 'Manage Requests',
            description: 'Review and approve requests',
            icon: FileText,
            href: '/requests',
            permissions: ['MANAGE_REQUESTS'],
            variant: 'secondary'
        },
        {
            id: 'view-reports',
            label: 'View Reports',
            description: 'Access department reports',
            icon: BarChart3,
            href: '/reports/transaction',
            permissions: ['VIEW_REPORTS'],
            variant: 'outline'
        },
        {
            id: 'add-batch',
            label: 'Add Batch',
            description: 'Add new inventory batch',
            icon: Layers,
            href: '/batch/add',
            permissions: ['ADD_BATCH'],
            variant: 'outline'
        }
    ],
    STAFF: [
        {
            id: 'browse-inventory',
            label: 'Browse Inventory',
            description: 'View available items',
            icon: Eye,
            href: '/inventory-items',
            permissions: ['VIEW_INVENTORY'],
            variant: 'default'
        },
        {
            id: 'view-cart',
            label: 'Shopping Cart',
            description: 'Manage your cart items',
            icon: ShoppingCart,
            href: '/cart',
            permissions: ['VIEW_CART'],
            variant: 'default'
        },
        {
            id: 'my-requests',
            label: 'My Requests',
            description: 'View your requests',
            icon: FileText,
            href: '/staff-requests',
            permissions: ['VIEW_REQUESTS'],
            variant: 'secondary'
        },
        {
            id: 'send-message',
            label: 'Send Message',
            description: 'Contact storekeeper',
            icon: MessageSquare,
            href: '/send-message',
            permissions: ['SEND_MESSAGES'],
            variant: 'outline'
        },
        {
            id: 'view-profile',
            label: 'My Profile',
            description: 'Update your profile',
            icon: User,
            href: '/profile',
            permissions: ['VIEW_PROFILE'],
            variant: 'outline'
        }
    ]
};

export function RoleBasedQuickActions() {
    const { user } = useAuthStore();
    const { canAccess } = usePermissionCheck();
    const navigate = useNavigate();

    if (!user?.role) {
        return null;
    }

    const roleActions = quickActionsByRole[user.role.name] || [];
    const availableActions = roleActions.filter(action => 
        canAccess(action.permissions as any[])
    );

    if (availableActions.length === 0) {
        return null;
    }

    const handleActionClick = (href: string) => {
        navigate(href);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Quick Actions
                    <Badge variant="secondary" className="ml-auto">
                        {user.role.name}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableActions.map((action) => (
                        <Button
                            key={action.id}
                            variant={action.variant || 'outline'}
                            className="h-auto p-4 flex flex-col items-start gap-2 text-left"
                            onClick={() => handleActionClick(action.href)}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <action.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">{action.label}</span>
                                {action.badge && (
                                    <Badge variant="outline" className="ml-auto text-xs">
                                        {action.badge}
                                    </Badge>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {action.description}
                            </span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
