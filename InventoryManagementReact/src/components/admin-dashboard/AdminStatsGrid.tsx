import {
    Users,
    Building2,
    Shield,
    TrendingUp,
    AlertTriangle,
    Plus,
    BarChart3,
    Settings,
    Bell,
    Activity,
    Package,
    CheckCircle,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import type { DashboardStats } from '@/types/dashboard';

// Icon mapping for dynamic icons
const iconMap = {
    Building2,
    Shield,
    Activity,
    Bell,
    Settings,
    Users,
    Package,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Plus,
    BarChart3,
} as const;

interface AdminStatsGridProps {
    stats: DashboardStats[];
}

export default function AdminStatsGrid({ stats }: AdminStatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {stat.change}
                                </p>
                            </div>
                            <div
                                className={`p-3 rounded-full ${stat.color.replace('text', 'bg').replace('-600', '-100')}`}
                            >
                                {(() => {
                                    const IconComponent =
                                        iconMap[
                                            stat.icon as keyof typeof iconMap
                                        ];
                                    return IconComponent ? (
                                        <IconComponent
                                            className={`h-6 w-6 ${stat.color}`}
                                        />
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
