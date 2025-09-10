import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartSummaryProps {
    totalItems: number;
    uniqueItems: number;
}

export default function CartSummary({ totalItems, uniqueItems }: CartSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                    <span>Unique Items</span>
                    <span className="font-medium">{uniqueItems}</span>
                </div>
            </CardContent>
        </Card>
    );
}
