export interface CartItem {
    id: number;
    itemId: number;
    itemName: string;
    imageUrl: string;
    quantity: number;
}



export interface CartItemRequestDto {
    id: number;
    quantity: number;
}
