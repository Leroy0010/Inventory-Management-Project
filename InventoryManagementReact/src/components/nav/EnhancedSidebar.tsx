import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { useResponsive } from '@/hooks/useResponsive';
import { Permission } from '@/types/permissions';
import {
    LayoutDashboard,
    Users,
    Package,
    Building,
    Layers,
    Package2,
    FileText,
    Bell,
    MessageSquare,
    Settings,
    Activity,
} from 'lucide-react';
import { EnhancedSidebarHeader } from './EnhancedSidebarHeader';
import { EnhancedSidebarNavigation } from './EnhancedSidebarNavigation';
import { EnhancedSidebarUserInfo } from './EnhancedSidebarUserInfo';
import { useAuthQueries } from '@/hooks/queries/useAuth';

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permissions?: Permission[];
    badge?: string;
    description?: string;
}

interface NavGroup {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
    permissions?: Permission[];
    description?: string;
}

const navGroups: NavGroup[] = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Overview and quick access',
        items: [
            {
                to: '/',
                label: 'Dashboard',
                icon: LayoutDashboard,
                permissions: ['VIEW_DASHBOARD'],
                description: 'Main dashboard view',
            },
        ],
    },
    {
        label: 'Management',
        icon: Users,
        description: 'Create and manage resources',
        items: [
            {
                to: '/staff/add',
                label: 'Add Staff',
                icon: Users,
                permissions: ['ADD_STAFF'],
                description: 'Add new staff member',
            },
            {
                to: '/inventory/add',
                label: 'Add Inventory',
                icon: Package,
                permissions: ['ADD_INVENTORY'],
                description: 'Add new inventory item',
            },
            {
                to: '/office/add',
                label: 'Add Office',
                icon: Building,
                permissions: ['ADD_OFFICE'],
                description: 'Add new office location',
            },
            {
                to: '/batch/add',
                label: 'Add Batch',
                icon: Layers,
                permissions: ['ADD_BATCH'],
                description: 'Add new inventory batch',
            },
            {
                to: '/storekeeper/add',
                label: 'Add Storekeeper',
                icon: Users,
                permissions: ['ADD_STOREKEEPER'],
                description: 'Add new storekeeper account',
                badge: 'Admin',
            },
            {
                to: '/departments/add',
                label: 'Add Department',
                icon: Building,
                permissions: ['ADD_DEPARTMENT'],
                description: 'Add new department',
                badge: 'Admin',
            },
        ],
    },
    {
        label: 'Inventory',
        icon: Package2,
        description: 'Manage inventory items and batches',
        items: [
            {
                to: '/inventory-items',
                label: 'Inventory Items',
                icon: Package2,
                permissions: ['VIEW_INVENTORY'],
                description: 'View and manage inventory',
            },
            {
                to: '/batch',
                label: 'Batches',
                icon: Layers,
                permissions: ['VIEW_BATCH'],
                description: 'View and manage batches',
            },
        ],
    },
    {
        label: 'Staff & Offices',
        icon: Users,
        description: 'Manage staff and office locations',
        items: [
            {
                to: '/staff',
                label: 'Staff',
                icon: Users,
                permissions: ['VIEW_STAFF'],
                description: 'View and manage staff',
            },
            {
                to: '/office',
                label: 'Offices',
                icon: Building,
                permissions: ['VIEW_OFFICE'],
                description: 'View and manage offices',
            },
        ],
    },
    {
        label: 'Departments',
        icon: Building,
        description: 'Manage organizational departments',
        items: [
            {
                to: '/departments',
                label: 'Departments',
                icon: Building,
                permissions: ['VIEW_DEPARTMENTS'],
                description: 'View and manage departments',
                badge: 'Admin',
            },
        ],
    },
    {
        label: 'Requests',
        icon: FileText,
        description: 'Handle and track requests',
        items: [
            {
                to: '/requests',
                label: 'Requests',
                icon: FileText,
                permissions: [Permission.VIEW_REQUESTS],
                description: 'View your requests',
            },
        ],
    },
    {
        label: 'Cart',
        icon: Package2,
        description: 'Shopping cart functionality',
        items: [
            {
                to: '/cart',
                label: 'Shopping Cart',
                icon: Package2,
                permissions: ['VIEW_CART'],
                description: 'Manage your cart items',
                badge: 'Staff',
            },
        ],
    },
    {
        label: 'Communication',
        icon: Bell,
        description: 'Notifications and messaging',
        items: [
            {
                to: '/notifications',
                label: 'Notifications',
                icon: Bell,
                permissions: ['VIEW_NOTIFICATIONS'],
                description: 'View system notifications',
            },
            {
                to: '/send-message',
                label: 'Send Message',
                icon: MessageSquare,
                permissions: ['SEND_MESSAGES'],
                description: 'Send messages to users',
            },
        ],
    },

    {
        label: 'Reports',
        icon: FileText,
        description: 'Analytics and reporting',
        items: [
            {
                to: '/reports/transaction',
                label: 'Transaction Report',
                icon: FileText,
                permissions: ['VIEW_TRANSACTION_REPORTS'],
                description: 'View transaction reports',
            },
            {
                to: '/reports/inventory-summary',
                label: 'Inventory Summary',
                icon: FileText,
                permissions: ['VIEW_INVENTORY_SUMMARY_REPORTS'],
                description: 'View inventory summary',
            },
            {
                to: '/reports/user',
                label: 'User Report',
                icon: FileText,
                permissions: ['VIEW_USER_REPORTS'],
                description: 'View user activity reports',
            },
            {
                to: '/reports/user-activity',
                label: 'User Activity',
                icon: Activity,
                permissions: ['VIEW_USER_REPORTS'],
                description: 'View detailed user activity',
            },
        ],
    },
    {
        label: 'System',
        icon: Settings,
        description: 'User settings and profile',
        items: [
            {
                to: '/profile',
                label: 'Profile',
                icon: Users,
                permissions: ['VIEW_PROFILE'],
                description: 'Manage your profile',
            },
            {
                to: '/settings',
                label: 'Settings',
                icon: Settings,
                permissions: ['VIEW_SETTINGS'],
                description: 'System settings',
            },
        ],
    },
];

export function EnhancedSidebar({
    isSidebarOpen,
    toggleSidebar,
}: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const { logout } = useAuthStore();
    const { canAccess } = usePermissionCheck();
    const { isMobile } = useResponsive();
    const {logoutMutation} = useAuthQueries();
    const navigate = useNavigate();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([
        'Dashboard',
    ]);



    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            logout();
        navigate('/login');
        if (isMobile) {
            toggleSidebar();
        }
        } catch (error) {
            // 
        }
        
    };

    const toggleGroup = (groupLabel: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupLabel)
                ? prev.filter((g) => g !== groupLabel)
                : [...prev, groupLabel]
        );
    };

    const handleItemClick = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={cn(
                    'bg-slate-800 dark:bg-slate-900 text-slate-100 flex flex-col h-full transition-all duration-300',
                    'w-64 fixed inset-y-0 left-0 z-50 md:static md:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <EnhancedSidebarHeader
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                <EnhancedSidebarNavigation
                    navGroups={navGroups}
                    expandedGroups={expandedGroups}
                    onToggleGroup={toggleGroup}
                    onItemClick={handleItemClick}
                    canAccess={canAccess}
                />

                <EnhancedSidebarUserInfo onLogout={handleLogout} />
            </aside>
        </>
    );
}
