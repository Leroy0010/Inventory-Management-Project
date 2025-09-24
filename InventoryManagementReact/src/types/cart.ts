export interface CartItem {
    id: number;
    itemId: number;
    itemName: string;
    imageUrl: string;
    quantity: number;
    unit: string;
}



export interface CartItemRequestDto {
    itemId: number;
    quantity: number;
}
