import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DepartmentSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function DepartmentSearch({
    searchTerm,
    onSearchChange,
}: DepartmentSearchProps) {
    return (
        <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );
}
