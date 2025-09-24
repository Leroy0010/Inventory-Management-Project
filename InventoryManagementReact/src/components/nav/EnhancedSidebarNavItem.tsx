import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Permission } from '@/types/permissions';

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permissions?: Permission[];
    badge?: string;
    description?: string;
}

interface EnhancedSidebarNavItemProps {
    item: NavItem;
    onItemClick: () => void;
}

export function EnhancedSidebarNavItem({
    item,
    onItemClick,
}: EnhancedSidebarNavItemProps) {
    const location = useLocation();

    return (
        <TooltipProvider key={item.to}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <NavLink
                        to={item.to}
                        onClick={onItemClick}
                        className={({ isActive }) => {
                            let isActiveState = isActive;

                            if (location.pathname === '/notifications') {
                                const hasSendTab =
                                    location.search.includes('tab=send');

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
                                <span>
                                    Requires: {item.permissions.join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
