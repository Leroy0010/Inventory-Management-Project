import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SidebarUserInfoProps {
    user: {
        firstName?: string;
        lastName?: string;
        role?: string;
    } | null;
    onLogout: () => void;
}

export function SidebarUserInfo({ user, onLogout }: SidebarUserInfoProps) {
    return (
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
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                user?.role === 'ADMIN'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : user?.role === 'STOREKEEPER'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}
                        >
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>
            <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-md transition-all duration-200 group"
            >
                <LogOut className="w-4 h-4 transition-all duration-200 group-hover:scale-110" />
                <span className="transition-all duration-200">Logout</span>
            </Button>
        </div>
    );
}
