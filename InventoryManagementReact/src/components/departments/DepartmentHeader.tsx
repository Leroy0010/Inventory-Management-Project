import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DepartmentHeaderProps {
    hasAddPermission: boolean;
    onAddClick: () => void;
}

export function DepartmentHeader({
    hasAddPermission,
    onAddClick,
}: DepartmentHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Departments
                </h1>
                <p className="text-muted-foreground">
                    Manage organizational departments and their configurations
                </p>
            </div>
            {hasAddPermission && (
                <Button onClick={onAddClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
                </Button>
            )}
        </div>
    );
}
