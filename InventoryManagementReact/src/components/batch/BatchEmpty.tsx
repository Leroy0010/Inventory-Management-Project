import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface BatchEmptyProps {
    onCreateBatch: () => void;
}

export default function BatchEmpty({ onCreateBatch }: BatchEmptyProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                    No batches found
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                    You haven't created any inventory batches yet. Create your first batch to start tracking stock levels.
                </p>
                <Button onClick={onCreateBatch}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Batch
                </Button>
            </CardContent>
        </Card>
    );
}
