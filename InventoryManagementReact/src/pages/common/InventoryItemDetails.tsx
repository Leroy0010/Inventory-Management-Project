import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    Edit,
    Trash2,
    ShoppingCart,
    Package,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    User,
    Building,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export default function InventoryItemDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isInCart, setIsInCart] = useState(false);

    const { useItemQuery, deleteItemMutation } = useInventoryItemQueries();
    const itemQuery = useItemQuery(Number(id));

    // Determine if user is storekeeper
    const isStorekeeper = user?.role === 'STOREKEEPER';

    // Calculate current quantity and reorder status
    const currentQuantity = itemQuery.data?.quantity || 0;
    const needsReorder = currentQuantity <= (itemQuery.data?.reorderLevel || 0);

    const handleDelete = async () => {
        if (!itemQuery.data) return;

        if (
            window.confirm(
                `Are you sure you want to delete "${itemQuery.data.name}"?`
            )
        ) {
            try {
                await deleteItemMutation.mutateAsync(itemQuery.data.id);
                toast.success('Item deleted successfully');
                navigate('/inventory-items');
            } catch (error) {
                // Error deleting item
                toast.error('Failed to delete item');
            }
        }
    };

    const handleEdit = () => {
        if (!itemQuery.data) return;
        navigate(`/storekeeper/edit-inventory/${itemQuery.data.id}`);
    };

    const handleAddToCart = () => {
        if (!itemQuery.data) return;
        toast.success(`${itemQuery.data.name} added to cart`);
        setIsInCart(true);
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (itemQuery.isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (itemQuery.error || !itemQuery.data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Item Not Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {itemQuery.error?.message ||
                            'The requested inventory item could not be found.'}
                    </p>
                    <Button onClick={handleBack}>Go Back</Button>
                </div>
            </div>
        );
    }

    const item = itemQuery.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {item.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Inventory Item Details
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {isStorekeeper ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="flex items-center space-x-2"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteItemMutation.isPending}
                                className="flex items-center space-x-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleAddToCart}
                            disabled={isInCart}
                            className={cn(
                                'flex items-center space-x-2',
                                isInCart
                                    ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            )}
                        >
                            {isInCart ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>In Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Package className="h-5 w-5" />
                            <span>Item Image</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                {item.imagePath ? (
                                    <img
                                        src={item.imagePath}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Reorder Warning Overlay */}
                            {needsReorder && (
                                <div className="absolute top-4 right-4">
                                    <Badge
                                        variant="destructive"
                                        className="text-sm"
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        Low Stock
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Item ID
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                        {item.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Unit
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {item.unit}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Department
                                </label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        Inventory Item
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Current Quantity
                                    </label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span
                                            className={cn(
                                                'text-2xl font-bold',
                                                needsReorder
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-900 dark:text-gray-100'
                                            )}
                                        >
                                            {currentQuantity}
                                        </span>
                                        {needsReorder && (
                                            <Badge variant="destructive">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Low Stock
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Reorder Level
                                    </label>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                        {item.reorderLevel}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={
                                    item.description ||
                                    'No description available'
                                }
                                readOnly
                                className="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
