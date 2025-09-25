import { SelectField } from '@/components/common/SelectField';

interface SortFiltersProps {
    sortBy: string;
    sortOrder: string;
    onSortByChange: (value: string) => void;
    onSortOrderChange: (value: string) => void;
    sortByError?: string;
    sortOrderError?: string;
}

const SORT_OPTIONS = [
    { value: 'userName', label: 'Name' },
    { value: 'totalRequestsSubmitted', label: 'Requests Submitted' },
    { value: 'totalRequestsApproved', label: 'Requests Approved' },
    { value: 'lastActivity', label: 'Last Activity' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

export function SortFilters({
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
    sortByError,
    sortOrderError,
}: SortFiltersProps) {
    return (
        <>
            <SelectField
                label="Sort By"
                value={sortBy}
                onValueChange={onSortByChange}
                options={SORT_OPTIONS}
                placeholder="Select sort field"
                error={sortByError}
                htmlFor="sortBy"
            />

            <SelectField
                label="Sort Order"
                value={sortOrder}
                onValueChange={onSortOrderChange}
                options={SORT_ORDER_OPTIONS}
                placeholder="Select sort order"
                error={sortOrderError}
                htmlFor="sortOrder"
            />
        </>
    );
}
