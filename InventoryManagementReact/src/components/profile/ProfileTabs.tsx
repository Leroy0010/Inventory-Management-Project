import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Settings } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    return (
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Info
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account
            </TabsTrigger>
        </TabsList>
    );
}
