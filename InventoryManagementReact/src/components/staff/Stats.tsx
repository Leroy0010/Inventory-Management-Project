import type { Staff } from '@/types/staff';
import { Badge } from '../ui/badge';
import { UserCheck, Users, UserX } from 'lucide-react';

interface StatsProps {
    staff: Staff[];
    activeCount: number;
    inactiveCount: number;
}

export default function Stats({
    activeCount,
    inactiveCount,
    staff,
}: StatsProps) {
    return (
        <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Total: {staff.length}
            </Badge>
            <Badge
                variant="outline"
                className="flex items-center gap-1 text-green-600"
            >
                <UserCheck className="w-3 h-3" />
                Active: {activeCount}
            </Badge>
            <Badge
                variant="outline"
                className="flex items-center gap-1 text-red-600"
            >
                <UserX className="w-3 h-3" />
                Inactive: {inactiveCount}
            </Badge>
        </div>
    );
}
