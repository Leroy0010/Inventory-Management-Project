import { SidebarNavGroup } from './SidebarNavGroup';
import { SidebarNavItem } from './SidebarNavItem';

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permissions?: string[];
}

interface NavGroup {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
    permissions?: string[];
}

interface SidebarNavigationProps {
    navGroups: NavGroup[];
    reportsGroup: NavGroup;
    expandedGroups: string[];
    onToggleGroup: (groupLabel: string) => void;
    onItemClick: () => void;
    canAccess: (permissions: any[]) => boolean;
}

export function SidebarNavigation({
    navGroups,
    reportsGroup,
    expandedGroups,
    onToggleGroup,
    onItemClick,
    canAccess,
}: SidebarNavigationProps) {
    return (
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navGroups.map((group) => (
                <SidebarNavGroup
                    key={group.label}
                    group={group}
                    isExpanded={expandedGroups.includes(group.label)}
                    onToggle={() => onToggleGroup(group.label)}
                    onItemClick={onItemClick}
                    canAccess={canAccess}
                />
            ))}

            {/* Reports group */}
            <SidebarNavGroup
                group={reportsGroup}
                isExpanded={expandedGroups.includes('Reports')}
                onToggle={() => onToggleGroup('Reports')}
                onItemClick={onItemClick}
                canAccess={canAccess}
            />
        </nav>
    );
}
