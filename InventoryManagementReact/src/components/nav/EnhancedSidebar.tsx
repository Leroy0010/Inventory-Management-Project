import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
    ChevronDown,
    Activity,
    LogOut,
    X,
    Shield,
    Eye,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        items: [{ 
            to: '/', 
            label: 'Dashboard', 
            icon: LayoutDashboard, 
            permissions: ['VIEW_DASHBOARD'],
            description: 'Main dashboard view'
        }],
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
                description: 'Add new staff member'
            },
            { 
                to: '/inventory/add', 
                label: 'Add Inventory', 
                icon: Package, 
                permissions: ['ADD_INVENTORY'],
                description: 'Add new inventory item'
            },
            { 
                to: '/office/add', 
                label: 'Add Office', 
                icon: Building, 
                permissions: ['ADD_OFFICE'],
                description: 'Add new office location'
            },
            { 
                to: '/batch/add', 
                label: 'Add Batch', 
                icon: Layers, 
                permissions: ['ADD_BATCH'],
                description: 'Add new inventory batch'
            },
            { 
                to: "/storekeeper/add", 
                label: "Add Storekeeper", 
                icon: Users, 
                permissions: ['ADD_STOREKEEPER'],
                description: 'Add new storekeeper account',
                badge: 'Admin'
            },
            { 
                to: '/departments/add', 
                label: 'Add Department', 
                icon: Building, 
                permissions: ['ADD_DEPARTMENT'],
                description: 'Add new department',
                badge: 'Admin'
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
                description: 'View and manage inventory'
            },
            { 
                to: '/batch', 
                label: 'Batches', 
                icon: Layers, 
                permissions: ['VIEW_BATCH'],
                description: 'View and manage batches'
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
                description: 'View and manage staff'
            },
            { 
                to: '/office', 
                label: 'Offices', 
                icon: Building, 
                permissions: ['VIEW_OFFICE'],
                description: 'View and manage offices'
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
                badge: 'Admin'
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
                label: 'Manage Requests', 
                icon: FileText, 
                permissions: ['MANAGE_REQUESTS'],
                description: 'Review and approve requests'
            },
            { 
                to: '/staff-requests', 
                label: 'My Requests', 
                icon: FileText, 
                permissions: [Permission.VIEW_REQUESTS],
                description: 'View your requests'
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
                badge: 'Staff'
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
                description: 'View system notifications'
            },
            { 
                to: '/send-message', 
                label: 'Send Message', 
                icon: MessageSquare, 
                permissions: ['SEND_MESSAGES'],
                description: 'Send messages to users'
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
                description: 'Manage your profile'
            },
            { 
                to: '/settings', 
                label: 'Settings', 
                icon: Settings, 
                permissions: ['VIEW_SETTINGS'],
                description: 'System settings'
            },
        ],
    },
];

const reportsGroup: NavGroup = {
    label: 'Reports',
    icon: FileText,
    description: 'Analytics and reporting',
    items: [
        { 
            to: '/reports/transaction', 
            label: 'Transaction Report', 
            icon: FileText, 
            permissions: ['VIEW_TRANSACTION_REPORTS'],
            description: 'View transaction reports'
        },
        { 
            to: '/reports/inventory-summary', 
            label: 'Inventory Summary', 
            icon: FileText, 
            permissions: ['VIEW_INVENTORY_SUMMARY_REPORTS'],
            description: 'View inventory summary'
        },
        { 
            to: '/reports/user', 
            label: 'User Report', 
            icon: FileText, 
            permissions: ['VIEW_USER_REPORTS'],
            description: 'View user activity reports'
        },
        { 
            to: '/reports/user-activity', 
            label: 'User Activity', 
            icon: Activity, 
            permissions: ['VIEW_USER_REPORTS'],
            description: 'View detailed user activity'
        },
    ],
    permissions: ['VIEW_REPORTS'],
};

export function EnhancedSidebar({
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

    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
        const hasPermission = !item.permissions || canAccess(item.permissions);
        if (!hasPermission) return null;

        const handleItemClick = () => {
            if (isMobile) {
                toggleSidebar();
            }
        };

        return (
            <TooltipProvider key={item.to}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <NavLink
                            to={item.to}
                            onClick={handleItemClick}
                            className={({ isActive }) => {
                                let isActiveState = isActive;

                                if (location.pathname === '/notifications') {
                                    const hasSendTab = location.search.includes('tab=send');
                                    
                                    if (item.to === '/notifications') {
                                        isActiveState = !hasSendTab;
                                    } else if (item.to === '/send-message') {
                                        isActiveState = hasSendTab;
                                    }
                                }

                                return cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    'relative group',
                                    !isActiveState && [
                                        'text-slate-300 hover:text-white',
                                        'hover:bg-slate-700/60 hover:shadow-md hover:scale-[1.02]',
                                        'hover:border-l-2 hover:border-slate-500',
                                    ],
                                    isActiveState && [
                                        'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg',
                                        'border-l-4 border-blue-400',
                                        'font-semibold',
                                        'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r-full',
                                        'shadow-blue-500/25',
                                        'scale-[1.02]',
                                        'ring-2 ring-blue-400/20',
                                        'backdrop-blur-sm',
                                    ]
                                );
                            }}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110" />
                            <span className="truncate transition-all duration-200">
                                {item.label}
                            </span>
                            {item.badge && (
                                <Badge 
                                    variant="outline" 
                                    className="ml-auto text-xs px-1.5 py-0.5"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                        <div className="space-y-1">
                            <p className="font-medium">{item.label}</p>
                            {item.description && (
                                <p className="text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            )}
                            {item.permissions && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Shield className="h-3 w-3" />
                                    <span>Requires: {item.permissions.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
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
                            <div className="text-left">
                                <div className="truncate">{group.label}</div>
                                {group.description && (
                                    <div className="text-xs text-slate-500 truncate">
                                        {group.description}
                                    </div>
                                )}
                            </div>
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
                {/* Header */}
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
                                    <div className="text-left">
                                        <div className="truncate">Reports</div>
                                        {reportsGroup.description && (
                                            <div className="text-xs text-slate-500 truncate">
                                                {reportsGroup.description}
                                            </div>
                                        )}
                                    </div>
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
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    user?.role.name === 'ADMIN' 
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : user?.role.name === 'STOREKEEPER'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                    {user?.role.name}
                                </span>
                            </div>
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
