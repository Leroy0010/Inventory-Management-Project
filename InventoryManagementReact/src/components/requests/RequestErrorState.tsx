import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RequestErrorStateProps {
    error: Error | unknown;
    onBack: () => void;
}

export function RequestErrorState({ error, onBack }: RequestErrorStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Error Loading Request
                </h2>
                <p className="text-muted-foreground">
                    {error instanceof Error
                        ? error.message
                        : 'An error occurred while loading the request.'}
                </p>
                <Button onClick={onBack} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Requests
                </Button>
            </div>
        </div>
    );
}
