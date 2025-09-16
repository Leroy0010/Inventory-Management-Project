import type { DashboardStats } from '@/types/dashboard';
import {
    Package,
    Users,
    Building2,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    FileText,
    Bell,
    Activity,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingCart,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

// Icon mapping for dynamic icons
const iconMap = {
    Package,
    Users,
    Building2,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    FileText,
    Bell,
    Activity,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingCart,
} as const;

interface StorekeeperStatsGridProps {
    stats: DashboardStats[];
}

export default function StorekeeperStatsGrid({
    stats,
}: StorekeeperStatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
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
