import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2 } from 'lucide-react';

export default function InventoryItems() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Items</h1>
        <p className="text-muted-foreground">
          View and manage all inventory items
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="w-5 h-5" />
            All Inventory Items
          </CardTitle>
          <CardDescription>
            Complete list of all inventory items in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No inventory items found</p>
            <p className="text-sm">Add inventory items to see them here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
