import React from 'react';
import { DataTable, type Column } from '@/components/ui/data-table';
import { SkeletonCard } from '@/components/ui/skeleton';
import { LoadingOverlay } from '@/components/ui/progress';
import { useInventoryQueries } from '@/hooks/queries/useInventory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface InventoryItem {
    id: number;
    name: string;
    description: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    department: {
        id: number;
        name: string;
    };
}

export default function InventoryItems() {
    const navigate = useNavigate();
    const { itemsQuery, deleteItemMutation } = useInventoryQueries();

    // Define table columns
    const columns: Column<InventoryItem>[] = [
        {
            key: 'name',
            header: 'Item Name',
            accessor: (item) => (
                <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.name}</span>
                </div>
            ),
            sortable: true,
            filterable: true,
        },
        {
            key: 'description',
            header: 'Description',
            accessor: (item) => (
                <span className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                </span>
            ),
        },
        {
            key: 'unit',
            header: 'Unit',
            accessor: (item) => (
                <Badge variant="secondary">{item.unit}</Badge>
            ),
            sortable: true,
        },
        {
            key: 'reorderLevel',
            header: 'Reorder Level',
            accessor: (item) => (
                <span className={item.reorderLevel <= 10 ? 'text-red-600 font-medium' : ''}>
                    {item.reorderLevel}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'department',
            header: 'Department',
            accessor: (item) => (
                <Badge variant="outline">{item.department.name}</Badge>
            ),
            sortable: true,
            filterable: true,
        },
        {
            key: 'actions',
            header: 'Actions',
            accessor: (item) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItemMutation.isPending}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
            width: '120px',
        },
    ];

    // Filter options for departments
    const departmentFilters = itemsQuery.data?.map(item => ({
        value: item.department.name,
        label: item.department.name,
    })) || [];

    const filters = [
        {
            key: 'department',
            label: 'Department',
            options: departmentFilters,
        },
    ];

    // Event handlers
    const handleEdit = (id: number) => {
        navigate(`/inventory/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItemMutation.mutateAsync(id);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleRowClick = (item: InventoryItem) => {
        navigate(`/inventory/${item.id}`);
    };

    const handleExport = () => {
        // Implement export functionality
        console.log('Exporting inventory items...');
    };

    // Loading state
    if (itemsQuery.isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Inventory Items</h1>
                    <SkeletonCard className="h-10 w-32" />
                </div>
                <SkeletonCard />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inventory Items</h1>
                <Button onClick={() => navigate('/inventory/add')}>
                    Add New Item
                </Button>
            </div>

            <LoadingOverlay isLoading={deleteItemMutation.isPending}>
                <DataTable
                    data={itemsQuery.data || []}
                    columns={columns}
                    isLoading={itemsQuery.isLoading}
                    error={itemsQuery.error?.message}
                    searchable={true}
                    searchPlaceholder="Search items..."
                    searchFields={['name', 'description']}
                    filterable={true}
                    filters={filters}
                    pagination={true}
                    pageSize={10}
                    sortable={true}
                    onRowClick={handleRowClick}
                    onExport={handleExport}
                    emptyMessage="No inventory items found. Add some items to get started."
                />
            </LoadingOverlay>
        </div>
    );
}