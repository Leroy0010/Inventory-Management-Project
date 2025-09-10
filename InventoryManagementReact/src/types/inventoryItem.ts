export interface InventoryItem {
    id: number;
    name: string;
    description?: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    quantity: number;
}

export interface InventoryItemNameAndIdResponseDto {
    id: number;
    name: string;
}

export interface CreateInventoryItemDto {
    name: string;
    description?: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
}

export interface UpdateInventoryItemDto {
    id: number;
    name: string;
    description?: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
}

export interface InventoryItemResponseDto {
    id: number;
    name: string;
    description?: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    quantity: number;
}
