import { useState, useMemo } from 'react';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Plus,
    Search,
    Grid3X3,
    List,
    AlertTriangle,
    ShoppingCart,
    Edit,
    Trash2,
} from 'lucide-react';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';
import InventoryItemCard from '@/components/cards/InventoryItemCard';
import InventoryItemDetails from '@/components/modals/InventoryItemDetails';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';

export default function InventoryItems() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] =
        useState<InventoryItemResponseDto | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { itemsQuery, deleteItemMutation } = useInventoryItemQueries();

    // Determine if user is storekeeper
    const isStorekeeper = user?.role.name === 'STOREKEEPER';

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

    const handleDelete = async (item: InventoryItemResponseDto) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            try {
                await deleteItemMutation.mutateAsync(item.id);
                toast.success('Item deleted successfully');
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error('Failed to delete item');
            }
        }
    };

    const handleEdit = (item: InventoryItemResponseDto) => {
        // Navigate to edit page or open edit modal
        navigate(`/storekeeper/edit-inventory/${item.id}`);
    };

    const handleAddToCart = (item: InventoryItemResponseDto) => {
        // Add to cart logic
        toast.success(`${item.name} added to cart`);
    };

    const handleViewDetails = (item: InventoryItemResponseDto) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
    };

    if (itemsQuery.isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (itemsQuery.error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Error Loading Items
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {itemsQuery.error.message}
                    </p>
                    <Button onClick={() => itemsQuery.refetch()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Inventory Items
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your inventory items and track stock levels
                    </p>
                </div>
                {isStorekeeper && (
                    <Button
                        onClick={() => navigate('/storekeeper/add-inventory')}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                    </Button>
                )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stats.total}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    In Stock
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stats.inStock}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Low Stock
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stats.lowStock}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Search className="h-5 w-5" />
                        <span>Search & Filter</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search items by name, unit, department, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={
                                    viewMode === 'grid' ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === 'list' ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items Display */}
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
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Items Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'No inventory items available'}
                            </p>
                            {isStorekeeper && !searchTerm && (
                                <Button
                                    onClick={() =>
                                        navigate('/storekeeper/add-inventory')
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Item
                                </Button>
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <InventoryItemCard
                                    key={item.id}
                                    item={item}
                                    isStorekeeperView={isStorekeeper}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onAddToCart={handleAddToCart}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <Package className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.unit} •{' '}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary">
                                            ID: {item.id}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleViewDetails(item)
                                            }
                                        >
                                            View Details
                                        </Button>
                                        {isStorekeeper ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Item Details Modal */}
            <InventoryItemDetails
                item={selectedItem}
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                isStorekeeperView={isStorekeeper}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
