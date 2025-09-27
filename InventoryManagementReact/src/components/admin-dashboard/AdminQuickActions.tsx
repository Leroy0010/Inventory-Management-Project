import type { QuickAction } from '@/types/dashboard';
import { Card, CardContent } from '../ui/card';
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
import { useNavigate } from 'react-router-dom';

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

interface AdminQuickActionsProps {
    quickActions: QuickAction[];
}

export default function AdminQuickActions({
    quickActions,
}: AdminQuickActionsProps) {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
                <Card
                    key={index}
                    className="hover:shadow-lg transition-all cursor-pointer group"
                    onClick={
                        action.action || (() => navigate(action.href || '/'))
                    }
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
                                <h3 className="font-semibold text-gray-400 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
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
