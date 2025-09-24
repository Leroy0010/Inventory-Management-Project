import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { InventoryItemDetailsHeader } from '@/components/inventory-item-details/InventoryItemDetailsHeader';
import { InventoryItemDetailsImage } from '@/components/inventory-item-details/InventoryItemDetailsImage';
import { InventoryItemDetailsInfo } from '@/components/inventory-item-details/InventoryItemDetailsInfo';
import { InventoryItemDetailsLoading } from '@/components/inventory-item-details/InventoryItemDetailsLoading';
import { InventoryItemDetailsError } from '@/components/inventory-item-details/InventoryItemDetailsError';

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
        return <InventoryItemDetailsLoading />;
    }

    if (itemQuery.error || !itemQuery.data) {
        return (
            <InventoryItemDetailsError
                onBack={handleBack}
                errorMessage={itemQuery.error?.message}
            />
        );
    }

    const item = itemQuery.data;

    return (
        <div className="space-y-6">
            <InventoryItemDetailsHeader
                item={item}
                isStorekeeper={isStorekeeper}
                isInCart={isInCart}
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
                isDeleting={deleteItemMutation.isPending}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InventoryItemDetailsImage
                    item={item}
                    needsReorder={needsReorder}
                />

                <InventoryItemDetailsInfo
                    item={item}
                    currentQuantity={currentQuantity}
                    needsReorder={needsReorder}
                />
            </div>
        </div>
    );
}
