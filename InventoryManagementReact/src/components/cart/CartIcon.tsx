import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function CartIcon() {
    const { totalItems, fetchCart } = useCartStore();
    const navigate = useNavigate();

    // Fetch cart data on component mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

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
