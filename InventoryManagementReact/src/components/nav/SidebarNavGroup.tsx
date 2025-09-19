import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface SidebarNavGroupProps {
    group: NavGroup;
    isExpanded: boolean;
    onToggle: () => void;
    onItemClick: () => void;
    canAccess: (permissions: any[]) => boolean;
}

export function SidebarNavGroup({
    group,
    isExpanded,
    onToggle,
    onItemClick,
    canAccess,
}: SidebarNavGroupProps) {
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
            onOpenChange={onToggle}
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
                {visibleItems.map((item) => (
                    <SidebarNavItem
                        key={item.to}
                        item={item}
                        onItemClick={onItemClick}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
