import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Batch() {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Batch Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage inventory batches and groups
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/batch/add')}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Batch
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Batches
                    </CardTitle>
                    <CardDescription>
                        View and manage all inventory batches
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No batches found</p>
                        <p className="text-sm">
                            Add your first batch to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
