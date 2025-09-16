import {  Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { AdminDashboard } from '@/types/dashboard';
import type { UserProfile } from '@/types/profile';
import type { User } from '@/types/auth';

interface AdminWelcomeSectionProps {
    dashboardData: AdminDashboard | undefined;
    profile: UserProfile | undefined;
    user: User | null;
}

export default function AdminWelcomeSection({dashboardData, profile, user}: AdminWelcomeSectionProps) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {dashboardData?.welcomeMessage ||
                            `Welcome back, ${profile?.firstName || user?.firstName}!`}
                    </h1>
                    <p className="text-blue-100 text-lg">
                        System Administrator Dashboard
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                        Manage departments, users, and system-wide settings
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Administrator
                    </Badge>
                    <p className="text-sm text-blue-200">
                        System Administrator
                    </p>
                </div>
            </div>
        </div>
    );
}
