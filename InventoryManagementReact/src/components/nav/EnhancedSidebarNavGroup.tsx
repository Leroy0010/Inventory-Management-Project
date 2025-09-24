import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { EnhancedSidebarNavItem } from './EnhancedSidebarNavItem';
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

interface EnhancedSidebarNavGroupProps {
    group: NavGroup;
    isExpanded: boolean;
    onToggle: (groupLabel: string) => void;
    onItemClick: () => void;
    canAccess: (permissions: Permission[]) => boolean;
}

export function EnhancedSidebarNavGroup({
    group,
    isExpanded,
    onToggle,
    onItemClick,
    canAccess,
}: EnhancedSidebarNavGroupProps) {
    const hasPermission =
        !group.permissions || canAccess(group.permissions as []);
    if (!hasPermission) return null;

    const visibleItems = group.items.filter(
        (item) => !item.permissions || canAccess(item.permissions as [])
    );
    if (visibleItems.length === 0) return null;

    return (
        <Collapsible
            key={group.label}
            open={isExpanded}
            onOpenChange={() => onToggle(group.label)}
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
                {visibleItems.map((item) => (
                    <EnhancedSidebarNavItem
                        key={item.to}
                        item={item}
                        onItemClick={onItemClick}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
