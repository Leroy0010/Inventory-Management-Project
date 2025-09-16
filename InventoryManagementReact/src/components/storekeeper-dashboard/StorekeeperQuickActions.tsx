import type { QuickAction } from '@/types/dashboard';
import { Card, CardContent } from '../ui/card';

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

interface StorekeeperQuickActionsProps {
    quickActions: QuickAction[];
}

export default function StorekeeperQuickActions({
    quickActions,
}: StorekeeperQuickActionsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
                <Card
                    key={index}
                    className="hover:shadow-lg transition-all cursor-pointer group"
                    onClick={action.action}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}
                            >
                                {(() => {
                                    const IconComponent =
                                        iconMap[
                                            action.icon as keyof typeof iconMap
                                        ];
                                    return IconComponent ? (
                                        <IconComponent className="h-6 w-6 text-white" />
                                    ) : null;
                                })()}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
