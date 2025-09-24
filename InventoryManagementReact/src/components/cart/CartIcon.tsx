import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartCount } from '@/hooks/queries/useCart';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function CartIcon() {
    const { hasPermission } = useAuthStore();
    const navigate = useNavigate();
    const canViewCart = hasPermission('VIEW_CART');
    const { data: totalItems = 0, isLoading } = useCartCount(canViewCart);

    // Only show cart icon for STAFF users
    if (!canViewCart) {
        return null;
    }

    const handleCartClick = () => {
        navigate('/cart');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white hover:bg-slate-600 relative"
            onClick={handleCartClick}
            aria-label="Shopping cart"
            disabled={isLoading}
        >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                    {totalItems}
                </Badge>
            )}
        </Button>
    );
}
