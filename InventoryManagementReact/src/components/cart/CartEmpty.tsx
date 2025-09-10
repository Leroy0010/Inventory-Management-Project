import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartEmpty() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground">Your cart is currently empty</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items in cart</h3>
          <p className="text-muted-foreground text-center mb-6">
            Browse inventory items and add them to your cart to make a request
          </p>
          <Button asChild>
            <Link to="/inventory-items">
              <Package className="mr-2 h-4 w-4" />
              Browse Inventory
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
