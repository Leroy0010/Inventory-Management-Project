import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface FilterActionButtonsProps {
    isLoading: boolean;
    handleClearFilters: () => void;
}

export default function FilterActionButtons({
    isLoading,
    handleClearFilters,
}: FilterActionButtonsProps) {
    return (
        <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                disabled={isLoading}
            >
                <X className="h-4 w-4 mr-2" />
                Clear
            </Button>
        </div>
    );
}
