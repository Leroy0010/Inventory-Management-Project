import type { UseFormSetValue } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface StatusFilterProps {
    watchedValues: any;
    setValue: UseFormSetValue<any>;
}

export default function StatusFilter({
    watchedValues,
    setValue,
}: StatusFilterProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="activeOnly">User Status</Label>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="activeOnly"
                    checked={watchedValues.activeOnly || false}
                    onCheckedChange={(checked) =>
                        setValue('activeOnly', checked as boolean)
                    }
                />
                <Label htmlFor="activeOnly" className="text-sm font-normal">
                    Show only active users
                </Label>
            </div>
        </div>
    );
}
