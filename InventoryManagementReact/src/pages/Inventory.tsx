import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

export default function Inventory() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Inventory Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your inventory items and stock levels
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inventory
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Inventory Items
                    </CardTitle>
                    <CardDescription>
                        View and manage all inventory items
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inventory items found</p>
                        <p className="text-sm">
                            Add your first inventory item to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
