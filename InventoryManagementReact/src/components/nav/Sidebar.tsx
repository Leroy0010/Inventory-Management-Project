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
import { SidebarHeader } from './SidebarHeader';
import { SidebarUserInfo } from './SidebarUserInfo';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarOverlay } from './SidebarOverlay';

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permissions?: Permission[];
}

interface NavGroup {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
    permissions?: Permission[];
}

const navGroups: NavGroup[] = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        items: [
            {
                to: '/',
                label: 'Dashboard',
                icon: LayoutDashboard,
                permissions: [Permission.VIEW_DASHBOARD],
            },
        ],
    },
    {
        label: 'Management',
        icon: Users,
        items: [
            {
                to: '/staff/add',
                label: 'Add Staff',
                icon: Users,
                permissions: [Permission.ADD_STAFF],
            },
            {
                to: '/inventory/add',
                label: 'Add Inventory',
                icon: Package,
                permissions: [Permission.ADD_INVENTORY],
            },
            {
                to: '/office/add',
                label: 'Add Office',
                icon: Building,
                permissions: [Permission.ADD_OFFICE],
            },
            {
                to: '/batch/add',
                label: 'Add Batch',
                icon: Layers,
                permissions: [Permission.ADD_BATCH],
            },
            {
                to: '/storekeeper/add',
                label: 'Add Storekeeper',
                icon: Users,
                permissions: [Permission.ADD_STOREKEEPER],
            },
            {
                to: '/departments/add',
                label: 'Add Department',
                icon: Building,
                permissions: [Permission.ADD_DEPARTMENT],
            },
        ],
    },
    {
        label: 'Inventory',
        icon: Package2,
        items: [
            {
                to: '/inventory-items',
                label: 'Inventory Items',
                icon: Package2,
                permissions: [Permission.VIEW_INVENTORY],
            },
            {
                to: '/batch',
                label: 'Batches',
                icon: Layers,
                permissions: [Permission.VIEW_BATCH],
            },
        ],
    },
    {
        label: 'Staff & Offices',
        icon: Users,
        items: [
            {
                to: '/staff',
                label: 'Staff',
                icon: Users,
                permissions: [Permission.VIEW_STAFF],
            },
            {
                to: '/office',
                label: 'Offices',
                icon: Building,
                permissions: [Permission.VIEW_OFFICE],
            },
        ],
    },
    {
        label: 'Departments',
        icon: Building,
        items: [
            {
                to: '/departments',
                label: 'Departments',
                icon: Building,
                permissions: [Permission.VIEW_DEPARTMENTS],
            },
        ],
    },
    {
        label: 'Requests',
        icon: FileText,
        items: [
            {
                to: '/requests',
                label: 'Manage Requests',
                icon: FileText,
                permissions: [Permission.MANAGE_REQUESTS],
            },
            {
                to: '/staff-requests',
                label: 'My Requests',
                icon: FileText,
                permissions: ['VIEW_REQUESTS'],
            },
        ],
    },
    {
        label: 'Cart',
        icon: Package2,
        items: [
            {
                to: '/cart',
                label: 'Shopping Cart',
                icon: Package2,
                permissions: [Permission.VIEW_CART],
            },
        ],
    },
    {
        label: 'Communication',
        icon: Bell,
        items: [
            {
                to: '/notifications',
                label: 'Notifications',
                icon: Bell,
                permissions: [Permission.VIEW_NOTIFICATIONS],
            },
            {
                to: '/send-message',
                label: 'Send Message',
                icon: MessageSquare,
                permissions: [Permission.SEND_MESSAGES],
            },
        ],
    },
    {
        label: 'System',
        icon: Settings,
        items: [
            {
                to: '/profile',
                label: 'Profile',
                icon: Users,
                permissions: [Permission.VIEW_PROFILE],
            },
            {
                to: '/settings',
                label: 'Settings',
                icon: Settings,
                permissions: [Permission.VIEW_SETTINGS],
            },
        ],
    },
];

const reportsGroup: NavGroup = {
    label: 'Reports',
    icon: FileText,
    items: [
        {
            to: '/reports/transaction',
            label: 'Transaction Report',
            icon: FileText,
            permissions: [Permission.VIEW_TRANSACTION_REPORTS],
        },
        {
            to: '/reports/inventory-summary',
            label: 'Inventory Summary',
            icon: FileText,
            permissions: [Permission.VIEW_INVENTORY_SUMMARY_REPORTS],
        },
        {
            to: '/reports/user',
            label: 'User Report',
            icon: FileText,
            permissions: [Permission.VIEW_USER_REPORTS],
        },
        {
            to: '/reports/user-activity',
            label: 'User Activity',
            icon: Activity,
            permissions: [Permission.VIEW_USER_REPORTS],
        },
    ],
    permissions: [Permission.VIEW_REPORTS],
};

export function Sidebar({
    isSidebarOpen,
    toggleSidebar,
}: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const { logout, user } = useAuthStore();
    const { canAccess } = usePermissionCheck();
    const { isMobile } = useResponsive();
    const navigate = useNavigate();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([
        'Dashboard',
    ]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        // Close sidebar on mobile when logging out
        if (isMobile) {
            toggleSidebar();
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
        // Close sidebar on mobile when item is clicked
        if (isMobile) {
            toggleSidebar();
        }
    };

    return (
        <>
            <SidebarOverlay isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <aside
                className={cn(
                    'bg-slate-800 dark:bg-slate-900 text-slate-100 flex flex-col h-full transition-all duration-300',
                    'w-64 fixed inset-y-0 left-0 z-50 md:static md:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <SidebarHeader isMobile={isMobile} onToggle={toggleSidebar} />

                <SidebarNavigation
                    navGroups={navGroups}
                    reportsGroup={reportsGroup}
                    expandedGroups={expandedGroups}
                    onToggleGroup={toggleGroup}
                    onItemClick={handleItemClick}
                    canAccess={canAccess}
                />

                <SidebarUserInfo user={user} onLogout={handleLogout} />
            </aside>
        </>
    );
}
