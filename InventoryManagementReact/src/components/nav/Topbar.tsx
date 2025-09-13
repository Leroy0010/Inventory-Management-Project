import { useState } from 'react';
import { Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { SearchBar } from '@/components/SearchBar';
import { useTheme } from '@/hooks/useTheme';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface TopbarProps {
    onMenuToggle?: () => void;
    isSidebarCollapsed?: boolean;
}

export function Topbar({
    onMenuToggle,
    isSidebarCollapsed = false,
}: TopbarProps) {
    const { user, logout } = useAuthStore();
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
                                {user?.role?.name.toLowerCase()}
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
