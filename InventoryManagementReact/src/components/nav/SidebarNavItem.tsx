import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permissions?: string[];
}

interface SidebarNavItemProps {
    item: NavItem;
    onItemClick: () => void;
}

export function SidebarNavItem({ item, onItemClick }: SidebarNavItemProps) {
    const location = useLocation();

    return (
        <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) => {
                let isActiveState = isActive;

                // Special handling for notifications page
                if (location.pathname === '/notifications') {
                    const hasSendTab = location.search.includes('tab=send');

                    if (item.to === '/notifications') {
                        // Notifications sidebar item: active only when send tab is NOT selected
                        isActiveState = !hasSendTab;
                    } else if (item.to === '/send-message') {
                        // Send Message sidebar item: active only when send tab IS selected
                        isActiveState = hasSendTab;
                    }
                }

                return cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'relative group',
                    // Inactive state styling
                    !isActiveState && [
                        'text-slate-300 hover:text-white',
                        'hover:bg-slate-700/60 hover:shadow-md hover:scale-[1.02]',
                        'hover:border-l-2 hover:border-slate-500',
                    ],
                    // Active state styling
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
        </NavLink>
    );
}
