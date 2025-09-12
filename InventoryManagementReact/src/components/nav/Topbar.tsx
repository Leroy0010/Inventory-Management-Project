import { useState } from 'react';
import { Bell, Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationsSafe } from '@/hooks/useNotificationsSafe';
import { SearchBar } from '@/components/SearchBar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface TopbarProps {
    onMenuToggle?: () => void;
    isSidebarCollapsed?: boolean;
}

export function Topbar({
    onMenuToggle,
    isSidebarCollapsed = false,
}: TopbarProps) {
    const { user, logout } = useAuthStore();
    const { unreadCount, notifications } = useNotificationsSafe();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="h-16 bg-slate-700 dark:bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-600 dark:border-slate-700">
            {/* Left: Menu toggle + Logo + Navigation arrows */}
            <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
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

                {/* Logo */}
                {/* <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">VIVE</span>
        </div> */}

                {/* Navigation arrows (hidden on mobile) */}
                {/* <div className="hidden md:flex items-center gap-1 ml-4">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-600">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div> */}
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-2 md:mx-4">
                <SearchBar />
            </div>

            {/* Right: Theme toggle + Notifications + User menu */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-600"
                    onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5" />
                    ) : (
                        <Moon className="w-5 h-5" />
                    )}
                </Button>

                {/* Notifications */}
                <DropdownMenu
                    open={isNotificationOpen}
                    onOpenChange={setIsNotificationOpen}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-slate-300 hover:text-white hover:bg-slate-600"
                            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto">
                                {notifications
                                    .slice(0, 5)
                                    .map((notification) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className="flex flex-col items-start p-3"
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <div
                                                    className={cn(
                                                        'w-2 h-2 rounded-full flex-shrink-0',
                                                        notification.isRead
                                                            ? 'bg-slate-300'
                                                            : 'bg-blue-500'
                                                    )}
                                                />
                                                <span className="font-medium text-sm truncate">
                                                    {notification.title}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <span className="text-xs text-slate-400 mt-1">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleTimeString()}
                                            </span>
                                        </DropdownMenuItem>
                                    ))}
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

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
                                {user?.role?.toLowerCase()}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
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
