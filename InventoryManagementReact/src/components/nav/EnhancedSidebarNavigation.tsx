import { EnhancedSidebarNavGroup } from './EnhancedSidebarNavGroup';
import { Permission } from '@/types/permissions';

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

interface EnhancedSidebarNavigationProps {
    navGroups: NavGroup[];
    expandedGroups: string[];
    onToggleGroup: (groupLabel: string) => void;
    onItemClick: () => void;
    canAccess: (permissions: Permission[]) => boolean;
}

export function EnhancedSidebarNavigation({
    navGroups,
    expandedGroups,
    onToggleGroup,
    onItemClick,
    canAccess,
}: EnhancedSidebarNavigationProps) {
    return (
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto !no-scrollbar">
            {navGroups.map((group) => (
                <EnhancedSidebarNavGroup
                    key={group.label}
                    group={group}
                    isExpanded={expandedGroups.includes(group.label)}
                    onToggle={onToggleGroup}
                    onItemClick={onItemClick}
                    canAccess={canAccess}
                />
            ))}
        </nav>
    );
}
