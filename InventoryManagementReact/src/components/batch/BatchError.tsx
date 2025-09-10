import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface BatchErrorProps {
    errorMessage: string;
    onRetry: () => void;
}

export default function BatchError({ errorMessage, onRetry }: BatchErrorProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                    Error Loading Batches
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                    {errorMessage}
                </p>
                <Button onClick={onRetry}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </CardContent>
        </Card>
    );
}
