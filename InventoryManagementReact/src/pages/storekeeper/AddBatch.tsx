import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import AddBatchForm from '@/components/forms/AddBatchForm';
import { Layers } from 'lucide-react';

export default function AddBatch() {
    return (
        <div className="space-y-6 min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Add Batch
                    </CardTitle>
                    <CardDescription>
                        Enter the details for the new batch
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddBatchForm />
                </CardContent>
            </Card>
        </div>
    );
}
