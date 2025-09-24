import { useState, useMemo, memo, useCallback } from 'react';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';
import InventoryItemDetails from '@/components/modals/InventoryItemDetails';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventoryStatistics } from '@/components/inventory/InventoryStatistics';
import { InventorySearch } from '@/components/inventory/InventorySearch';
import { InventoryGridView } from '@/components/inventory/InventoryGridView';
import { InventoryListView } from '@/components/inventory/InventoryListView';
import { InventoryEmptyState } from '@/components/inventory/InventoryEmptyState';
import { InventoryLoadingState } from '@/components/inventory/InventoryLoadingState';
import { InventoryErrorState } from '@/components/inventory/InventoryErrorState';
import { useCartQueries } from '@/hooks/queries/useCart';

type ViewMode = 'grid' | 'list';

const InventoryItems = memo(function InventoryItems() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] =
        useState<InventoryItemResponseDto | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { itemsQuery, deleteItemMutation } = useInventoryItemQueries();
    const { addItemMutation } = useCartQueries(user?.role === 'STAFF');

    // Determine if user is storekeeper
    const isStorekeeper = user?.role === 'STOREKEEPER';

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!itemsQuery.data) return [];

        return itemsQuery.data.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toString().includes(searchTerm)
        );
    }, [itemsQuery.data, searchTerm]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!itemsQuery.data) return { total: 0, lowStock: 0, inStock: 0 };

        const total = itemsQuery.data.length;
        const lowStock = itemsQuery.data.filter(
            (item) => item.reorderLevel >= item.quantity
        ).length;
        const inStock = total - lowStock;

        return { total, lowStock, inStock };
    }, [itemsQuery.data]);

    const handleDelete = useCallback(
        async (item: InventoryItemResponseDto) => {
            if (
                window.confirm(
                    `Are you sure you want to delete "${item.name}"?`
                )
            ) {
                try {
                    await deleteItemMutation.mutateAsync(item.id);
                    toast.success('Item deleted successfully');
                } catch (error) {
                    // Error deleting item
                    toast.error('Failed to delete item');
                }
            }
        },
        [deleteItemMutation]
    );

    const handleEdit = useCallback(
        (item: InventoryItemResponseDto) => {
            // Navigate to edit page or open edit modal
            navigate(`/storekeeper/edit-inventory/${item.id}`);
        },
        [navigate]
    );

    const handleToggleCart = useCallback(
        async (item: InventoryItemResponseDto) => {
            try {
                await addItemMutation.mutateAsync({
                    itemId: item.id,
                    quantity: 1,
                });
                toast.success(`${item.name} added to cart`);
            } catch (error) {
                toast.error('Failed to add item');
            }
        },
        [addItemMutation]
    );

    const handleViewDetails = useCallback((item: InventoryItemResponseDto) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
    }, []);

    if (itemsQuery.isLoading) {
        return <InventoryLoadingState />;
    }

    if (itemsQuery.error) {
        return (
            <InventoryErrorState
                error={itemsQuery.error}
                onRetry={() => itemsQuery.refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <InventoryHeader
                isStorekeeper={isStorekeeper}
                onAddClick={() => navigate('/storekeeper/add-inventory')}
            />

            {isStorekeeper && <InventoryStatistics stats={stats} />}

            <InventorySearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5" />
                            <span>Items ({filteredItems.length})</span>
                        </div>
                        {filteredItems.length > 0 && (
                            <Badge variant="secondary">
                                {viewMode === 'grid'
                                    ? 'Grid View'
                                    : 'List View'}
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {filteredItems.length === 0
                            ? 'No items found matching your search criteria'
                            : 'A list of all inventory items in your system'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredItems.length === 0 ? (
                        <InventoryEmptyState
                            hasSearchTerm={!!searchTerm}
                            isStorekeeper={isStorekeeper}
                            onAddClick={() =>
                                navigate('/storekeeper/add-inventory')
                            }
                        />
                    ) : viewMode === 'grid' ? (
                        <InventoryGridView
                            items={filteredItems}
                            isStorekeeper={isStorekeeper}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddToCart={handleToggleCart}
                            onViewDetails={handleViewDetails}
                        />
                    ) : (
                        <InventoryListView
                            items={filteredItems}
                            isStorekeeper={isStorekeeper}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddToCart={handleToggleCart}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </CardContent>
            </Card>

            <InventoryItemDetails
                item={selectedItem}
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                isStorekeeperView={isStorekeeper}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToCart={handleToggleCart}
            />
        </div>
    );
});

export default InventoryItems;
