import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { useResponsive } from '@/hooks/useResponsive';
import type { Permission } from '@/types/permissions';
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
    ChevronDown,
    Activity,
    LogOut,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
        items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Management',
        icon: Users,
        items: [
            { to: '/staff/add', label: 'Add Staff', icon: Users },
            { to: '/inventory/add', label: 'Add Inventory', icon: Package },
            { to: '/office/add', label: 'Add Office', icon: Building },
            { to: '/batch/add', label: 'Add Batch', icon: Layers },
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
            },
        ],
    },
    {
        label: 'Requests',
        icon: FileText,
        items: [{ to: '/requests', label: 'Requests', icon: FileText }],
    },
    {
        label: 'Communication',
        icon: Bell,
        items: [
            { to: '/notifications', label: 'Notifications', icon: Bell },
            { to: '/send-message', label: 'Send Message', icon: MessageSquare },
        ],
    },
    {
        label: 'System',
        icon: Settings,
        items: [{ to: '/settings', label: 'Settings', icon: Settings }],
    },
];

const reportsGroup: NavGroup = {
    label: 'Reports',
    icon: FileText,
    items: [
        { to: '/reports/transaction', label: 'Transaction', icon: FileText },
        {
            to: '/reports/inventory-summary',
            label: 'Inventory Summary',
            icon: FileText,
        },
        { to: '/reports/user', label: 'User', icon: FileText },
        {
            to: '/reports/user-activity',
            label: 'User Activity',
            icon: Activity,
        },
    ],
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

    const renderNavItem = (item: NavItem) => {
        const hasPermission =
            !item.permissions || canAccess(item.permissions);
        if (!hasPermission) return null;

        const handleItemClick = () => {
            // Close sidebar on mobile when item is clicked
            if (isMobile) {
                toggleSidebar();
            }
        };

        return (
            <NavLink
                key={item.to}
                to={item.to}
                onClick={handleItemClick}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        'relative group',
                        // Inactive state styling
                        !isActive && [
                            'text-slate-300 hover:text-white',
                            'hover:bg-slate-700/60 hover:shadow-md hover:scale-[1.02]',
                            'hover:border-l-2 hover:border-slate-500',
                        ],
                        // Active state styling
                        isActive && [
                            'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg',
                            'border-l-4 border-blue-400',
                            'font-semibold',
                            'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r-full',
                            'shadow-blue-500/25',
                            'scale-[1.02]',
                            'ring-2 ring-blue-400/20',
                            'backdrop-blur-sm',
                        ]
                    )
                }
            >
                <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110" />
                <span className="truncate transition-all duration-200">
                    {item.label}
                </span>
            </NavLink>
        );
    };

    const renderNavGroup = (group: NavGroup) => {
        const hasPermission =
            !group.permissions || canAccess(group.permissions as []);
        const isExpanded = expandedGroups.includes(group.label);
        if (!hasPermission) return null;

        const visibleItems = group.items.filter(
            (item) => !item.permissions || canAccess(item.permissions as [])
        );
        if (visibleItems.length === 0) return null;

        return (
            <Collapsible
                key={group.label}
                open={isExpanded}
                onOpenChange={() => toggleGroup(group.label)}
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-between px-3 py-2.5 text-sm font-medium text-slate-300 dark:text-slate-400 hover:text-white hover:bg-slate-700/60 hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <group.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110" />
                            <span className="truncate">{group.label}</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-all duration-200 group-hover:scale-110',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-6">
                    {visibleItems.map(renderNavItem)}
                </CollapsibleContent>
            </Collapsible>
        );
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
                {/* Header with Close button (mobile only) */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                            <Package className="w-5 h-5 text-white drop-shadow-sm" />
                        </div>
                        <span className="font-bold text-lg text-white">
                            Inventory
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleSidebar}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navGroups.map(renderNavGroup)}

                    {/* Reports group */}
                    <Collapsible
                        open={expandedGroups.includes('Reports')}
                        onOpenChange={() => toggleGroup('Reports')}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <reportsGroup.icon className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
                                    <span className="truncate">Reports</span>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        'w-4 h-4 transition-all duration-200 group-hover:scale-110',
                                        expandedGroups.includes('Reports') &&
                                            'rotate-180'
                                    )}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pl-6">
                            {reportsGroup.items.map(renderNavItem)}
                        </CollapsibleContent>
                    </Collapsible>
                </nav>

                {/* User Info & Logout */}
                <div className="border-t border-slate-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                                {user?.firstName?.[0]}
                                {user?.lastName?.[0]}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {user?.role.name}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-md transition-all duration-200 group"
                    >
                        <LogOut className="w-4 h-4 transition-all duration-200 group-hover:scale-110" />
                        <span className="transition-all duration-200">
                            Logout
                        </span>
                    </Button>
                </div>
            </aside>
        </>
    );
}
