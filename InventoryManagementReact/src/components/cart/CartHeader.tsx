import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface CartHeaderProps {
    totalItems: number;
    isLoading: boolean;
    onRefresh: () => void;
    onCheckout: () => void;
    isSubmitting: boolean;
}

export default function CartHeader({
    totalItems,
    isLoading,
    onRefresh,
    onCheckout,
    isSubmitting,
}: CartHeaderProps) {
    const { hasPermission } = usePermissions();

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-muted-foreground">
                    Review your items before submitting a request
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                    {totalItems} items
                </Badge>
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isLoading}
                    aria-label="Refresh cart data"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                {hasPermission('CHECKOUT_CART') && (
                    <Button 
                        onClick={onCheckout}
                        disabled={isSubmitting}
                        aria-label="Submit cart as request"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Request
                    </Button>
                )}
            </div>
        </div>
    );
}
