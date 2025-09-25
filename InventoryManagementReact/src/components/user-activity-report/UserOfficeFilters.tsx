import { ComboboxField } from '@/components/common/ComboboxField';
import type { ComboboxOption } from '@/components/ui/combobox';

interface UserOfficeFiltersProps {
    officeId: string;
    userId: string;
    onOfficeChange: (value: string) => void;
    onUserChange: (value: string) => void;
    officeOptions: ComboboxOption[];
    userOptions: ComboboxOption[];
    officeError?: string;
    userError?: string;
}

export function UserOfficeFilters({
    officeId,
    userId,
    onOfficeChange,
    onUserChange,
    officeOptions,
    userOptions,
    officeError,
    userError,
}: UserOfficeFiltersProps) {
    return (
        <>
            <ComboboxField
                label="Office"
                value={officeId}
                onValueChange={onOfficeChange}
                options={officeOptions}
                placeholder="Select office"
                error={officeError}
                htmlFor="officeId"
            />

            <ComboboxField
                label="User"
                value={userId}
                onValueChange={onUserChange}
                options={userOptions}
                placeholder="Select user"
                error={userError}
                htmlFor="userId"
            />
        </>
    );
}
