import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import InventoryItemCard from '@/components/cards/InventoryItemCard';
import InventoryItemDetails from '@/components/modals/InventoryItemDetails';
import {
    Package,
    User,
    Settings,
    ShoppingCart,
    Edit,
    Trash2,
    Eye,
} from 'lucide-react';
import { InventoryItemResponseDto } from '@/api/inventoryItem';

// Mock data for demonstration
const mockInventoryItems: InventoryItemResponseDto[] = [
    {
        id: 1,
        name: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        unit: 'pieces',
        reorderLevel: 5,
        imagePath:
            'https://images.unsplash.com/photo-1586023492125-27b2c4ef00d7?w=400&h=300&fit=crop',
        department: { id: 1, name: 'Office Supplies' },
        batches: [
            {
                id: 1,
                quantity: 15,
                unitPrice: 299.99,
                supplierName: 'Office Depot',
                invoiceId: 'INV-001',
                receivedAt: '2024-01-15T10:00:00Z',
                inventoryItem: {} as any,
            },
        ],
    },
    {
        id: 2,
        name: 'Laptop Computer',
        description: 'High-performance laptop for office use',
        unit: 'pieces',
        reorderLevel: 3,
        imagePath:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        department: { id: 2, name: 'IT Equipment' },
        batches: [
            {
                id: 2,
                quantity: 2,
                unitPrice: 1299.99,
                supplierName: 'Tech Solutions Inc',
                invoiceId: 'INV-002',
                receivedAt: '2024-01-20T14:30:00Z',
                inventoryItem: {} as any,
            },
        ],
    },
    {
        id: 3,
        name: 'A4 Paper',
        description: 'White A4 paper for printing',
        unit: 'reams',
        reorderLevel: 10,
        imagePath:
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
        department: { id: 1, name: 'Office Supplies' },
        batches: [
            {
                id: 3,
                quantity: 25,
                unitPrice: 12.99,
                supplierName: 'Paper Co',
                invoiceId: 'INV-003',
                receivedAt: '2024-01-25T09:15:00Z',
                inventoryItem: {} as any,
            },
        ],
    },
    {
        id: 4,
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        unit: 'pieces',
        reorderLevel: 8,
        imagePath: null, // No image to test fallback
        department: { id: 1, name: 'Office Supplies' },
        batches: [
            {
                id: 4,
                quantity: 12,
                unitPrice: 45.99,
                supplierName: 'Lighting Solutions',
                invoiceId: 'INV-004',
                receivedAt: '2024-01-28T16:45:00Z',
                inventoryItem: {} as any,
            },
        ],
    },
];

export default function InventoryCardDemo() {
    const [isStorekeeperView, setIsStorekeeperView] = useState(false);
    const [selectedItem, setSelectedItem] =
        useState<InventoryItemResponseDto | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [cartItems, setCartItems] = useState<Set<number>>(new Set());

    const handleEdit = (item: InventoryItemResponseDto) => {
        console.log('Edit item:', item);
        alert(`Edit functionality for: ${item.name}`);
    };

    const handleDelete = (item: InventoryItemResponseDto) => {
        console.log('Delete item:', item);
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            alert(`Delete functionality for: ${item.name}`);
        }
    };

    const handleAddToCart = (item: InventoryItemResponseDto) => {
        console.log('Add to cart:', item);
        setCartItems((prev) => new Set([...prev, item.id]));
        alert(`${item.name} added to cart!`);
    };

    const handleViewDetails = (item: InventoryItemResponseDto) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
    };

    const isInCart = (itemId: number) => cartItems.has(itemId);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Inventory Card Components Demo
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Interactive demonstration of inventory item cards and
                    details modal
                </p>
            </div>

            {/* Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Demo Controls</span>
                    </CardTitle>
                    <CardDescription>
                        Toggle between different user roles and view modes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="storekeeper-view"
                                checked={isStorekeeperView}
                                onCheckedChange={setIsStorekeeperView}
                            />
                            <Label htmlFor="storekeeper-view">
                                Storekeeper View
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Current Role:{' '}
                                {isStorekeeperView ? 'Storekeeper' : 'Staff'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Items in Cart: {cartItems.size}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feature Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Component Features</CardTitle>
                    <CardDescription>
                        Key features demonstrated in this demo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Package,
                                title: 'Item Display',
                                desc: 'Image, name, unit, and basic info',
                            },
                            {
                                icon: User,
                                title: 'Role-based Actions',
                                desc: 'Different buttons for different user roles',
                            },
                            {
                                icon: ShoppingCart,
                                title: 'Cart Integration',
                                desc: 'Add to cart functionality with state',
                            },
                            {
                                icon: Edit,
                                title: 'Edit Actions',
                                desc: 'Edit and delete item capabilities',
                            },
                            {
                                icon: Eye,
                                title: 'Details Modal',
                                desc: 'Comprehensive item details view',
                            },
                            {
                                icon: Settings,
                                title: 'Responsive Design',
                                desc: 'Mobile-friendly card layout',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <feature.icon className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-sm">
                                        {feature.title}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Cards Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>
                            Inventory Items ({mockInventoryItems.length})
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Click on cards to interact with them. Try different user
                        roles above.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mockInventoryItems.map((item) => (
                            <InventoryItemCard
                                key={item.id}
                                item={item}
                                isStorekeeperView={isStorekeeperView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAddToCart={handleAddToCart}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Interactive Examples */}
            <Card>
                <CardHeader>
                    <CardTitle>Interactive Examples</CardTitle>
                    <CardDescription>
                        Try these interactions to see the components in action
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h4 className="font-medium mb-2">
                                    Role Switching
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Toggle the "Storekeeper View" switch above
                                    to see different action buttons
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        variant={
                                            isStorekeeperView
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {isStorekeeperView
                                            ? 'Storekeeper'
                                            : 'Staff'}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {isStorekeeperView
                                            ? 'Shows Edit/Delete buttons'
                                            : 'Shows Add to Cart button'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h4 className="font-medium mb-2">
                                    Card Interactions
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Click on any card to see the detailed view
                                    modal
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline">
                                        View Details
                                    </Badge>
                                    <Badge variant="outline">Add to Cart</Badge>
                                    <Badge variant="outline">Edit/Delete</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Item Details Modal */}
            <InventoryItemDetails
                item={selectedItem}
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                isStorekeeperView={isStorekeeperView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
