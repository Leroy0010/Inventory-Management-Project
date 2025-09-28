import { CartIcon } from '@/components/cart/CartIcon';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { SearchBar } from '@/components/SearchBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeTopbar } from '@/hooks/useThemeTopbar';
import { useAuthStore } from '@/stores/authStore';
import { LogOut, Menu, Moon, Settings, Sun, User, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/queries/useAuth';

interface TopbarProps {
    onMenuToggle?: () => void;
    isSidebarCollapsed?: boolean;
}

export function Topbar({
    onMenuToggle,
    isSidebarCollapsed = false,
}: TopbarProps) {
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const { theme, setTheme, resolvedTheme } = useThemeTopbar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            //
        }
    };

    const cycleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    const getThemeIcon = () => {
        if (theme === 'system') {
            return <Monitor className="w-5 h-5" />;
        }
        return resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
        ) : (
            <Moon className="w-5 h-5" />
        );
    };

    return (
        <header className="h-16 bg-slate-700 dark:bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-600 dark:border-slate-700">
            {/* Left: Menu toggle */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuToggle}
                    className="text-slate-300 hover:text-white hover:bg-slate-600 md:hidden"
                    aria-label={
                        isSidebarCollapsed
                            ? 'Expand sidebar'
                            : 'Collapse sidebar'
                    }
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Logo (optional) */}
                {/* <div className="flex items-center gap-2">Logo here</div> */}
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-2 md:mx-4">
                <SearchBar />
            </div>

            {/* Right: Theme toggle, Cart, Notifications, User menu */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-600"
                    onClick={cycleTheme}
                    title={`Current theme: ${theme}${theme === 'system' ? ` (${resolvedTheme})` : ''}`}
                >
                    {getThemeIcon()}
                </Button>

                {/* Cart */}
                <CartIcon />

                {/* Notifications (live badge) */}
                <NotificationBell />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-600 px-2"
                        >
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-slate-600 text-white text-sm">
                                    {user?.firstName?.[0]}
                                    {user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:block font-medium">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="flex flex-col">
                            <span className="font-medium">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="text-xs text-slate-500">
                                {user?.email}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">
                                {user?.role.toLowerCase()}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className="flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
