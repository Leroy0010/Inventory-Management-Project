import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface CartItem {
  id: string;
  inventoryItemId: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  availableQuantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Cart() {
  const { hasPermission } = usePermissions();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCart: Cart = {
      id: '1',
      items: [
        {
          id: '1',
          inventoryItemId: 'inv-1',
          name: 'A4 Paper Sheets',
          description: 'White A4 paper, 80gsm',
          sku: 'PAPER-A4-001',
          quantity: 5,
          availableQuantity: 100,
          unitPrice: 12.50,
          totalPrice: 62.50,
          notes: 'For office printing'
        },
        {
          id: '2',
          inventoryItemId: 'inv-2',
          name: 'Blue Ballpoint Pens',
          description: 'Standard blue ink ballpoint pens',
          sku: 'PEN-BLUE-001',
          quantity: 10,
          availableQuantity: 200,
          unitPrice: 1.25,
          totalPrice: 12.50,
          notes: 'For daily use'
        },
        {
          id: '3',
          inventoryItemId: 'inv-3',
          name: 'Stapler',
          description: 'Heavy-duty stapler with staples',
          sku: 'STAPLER-001',
          quantity: 2,
          availableQuantity: 15,
          unitPrice: 25.00,
          totalPrice: 50.00,
          notes: 'For document binding'
        }
      ],
      totalItems: 17,
      totalAmount: 125.00,
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z'
    };
    
    setCart(mockCart);
    setLoading(false);
  }, []);

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (!cart) return;
    
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cart.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          quantity: Math.min(newQuantity, item.availableQuantity),
          totalPrice: Math.min(newQuantity, item.availableQuantity) * item.unitPrice
        };
        return updatedItem;
      }
      return item;
    });

    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalItems,
      totalAmount
    });
  };

  const removeItem = (itemId: string) => {
    if (!cart) return;
    
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalItems,
      totalAmount
    });
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    
    // TODO: Implement API call
    console.log('Checking out cart:', {
      cartId: cart.id,
      items: cart.items,
      notes: checkoutNotes
    });
    
    setIsCheckoutDialogOpen(false);
    setCheckoutNotes('');
    
    // Clear cart after successful checkout
    setCart({
      ...cart,
      items: [],
      totalItems: 0,
      totalAmount: 0
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Your cart is currently empty
          </p>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items in cart</h3>
            <p className="text-muted-foreground text-center mb-6">
              Browse inventory items and add them to your cart to make a request
            </p>
            <Button onClick={() => window.location.href = '/inventory-items'}>
              <Package className="mr-2 h-4 w-4" />
              Browse Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items before submitting a request
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {cart.totalItems} items
          </Badge>
          {hasPermission('CHECKOUT_CART') && (
            <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Request</DialogTitle>
                  <DialogDescription>
                    Review your items and add any notes before submitting the request
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Items Summary</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${cart.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      placeholder="Add any additional notes for this request..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCheckout}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-blue-600 mt-1">
                              Note: {item.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.sku}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {hasPermission('REMOVE_FROM_CART') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                          <span className="w-8 text-center">{item.quantity}</span>
                          {hasPermission('ADD_TO_CART') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.availableQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Available: {item.availableQuantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{item.unitPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 font-medium">
                          <DollarSign className="h-3 w-3" />
                          <span>{item.totalPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {hasPermission('REMOVE_FROM_CART') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({cart.totalItems})</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Important Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• All requests require approval from your supervisor</p>
              <p>• Items will be delivered to your office location</p>
              <p>• You will be notified when your request is approved or rejected</p>
              <p>• Contact your storekeeper if you have any questions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
