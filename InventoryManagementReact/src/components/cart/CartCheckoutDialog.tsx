import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';
import type { CartItem } from '@/types/cart';

interface CartCheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    items: CartItem[];
    totalItems: number;
    notes: string;
    onNotesChange: (notes: string) => void;
    isSubmitting: boolean;
}

export default function CartCheckoutDialog({
    isOpen,
    onClose,
    onSubmit,
    items,
    totalItems,
    notes,
    onNotesChange,
    isSubmitting,
}: CartCheckoutDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.itemName} x {item.quantity}
                                    </span>
                                    <span>
                                        {item.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="notes">
                            Notes (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Add any additional notes for this request..."
                            className="min-h-[100px]"
                            aria-describedby="notes-description"
                        />
                        <p id="notes-description" className="text-xs text-muted-foreground mt-1">
                            Optional notes to include with your request
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        aria-label="Submit request with current cart items"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Request'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
