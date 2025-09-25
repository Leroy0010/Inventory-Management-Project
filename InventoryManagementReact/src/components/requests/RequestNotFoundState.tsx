import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RequestNotFoundStateProps {
    onBack: () => void;
}

export function RequestNotFoundState({ onBack }: RequestNotFoundStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Request Not Found
                </h2>
                <p className="text-muted-foreground">
                    The requested item could not be found.
                </p>
                <Button onClick={onBack} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Requests
                </Button>
            </div>
        </div>
    );
}
