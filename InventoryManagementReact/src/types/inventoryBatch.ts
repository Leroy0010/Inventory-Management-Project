export interface CreateBatchDto {
    itemName: string;
    quantity: number;
    totalPrice: number;
    supplierName?: string;
    invoiceId?: string;
}

export interface InventoryBatch {
    id: number;
    quantity: number;
    totalPrice: number;
    supplierName?: string;
    invoiceId?: string;
    remainingQuantity: number;
    inventoryItemName: string;
    inventoryItemId: number;
    batchDate: Date;
}
