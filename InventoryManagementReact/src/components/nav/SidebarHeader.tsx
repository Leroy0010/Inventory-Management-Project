import { Button } from '@/components/ui/button';
import { Package, X } from 'lucide-react';

interface SidebarHeaderProps {
    isMobile: boolean;
    onToggle: () => void;
}

export function SidebarHeader({ isMobile, onToggle }: SidebarHeaderProps) {
    return (
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                    <Package className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
                <span className="font-bold text-lg text-white">Inventory</span>
            </div>
            {isMobile && (
                <Button variant="ghost" size="icon" onClick={onToggle}>
                    <X className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
}
