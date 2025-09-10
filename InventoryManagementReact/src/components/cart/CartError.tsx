import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface CartErrorProps {
    friendlyMessage: string;
    handleRefreshCart: () => void
}

export default function CartError({friendlyMessage, handleRefreshCart}: CartErrorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Error Loading Cart
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {friendlyMessage}
                </p>
                <Button onClick={handleRefreshCart}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
