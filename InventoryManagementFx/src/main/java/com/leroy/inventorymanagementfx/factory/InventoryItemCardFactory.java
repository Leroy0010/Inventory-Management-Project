package com.leroy.inventorymanagementfx.factory;

import com.leroy.inventorymanagementfx.controller.InventoryItemCardController;
import com.leroy.inventorymanagementfx.dto.response.InventoryItemResponse;

import java.util.function.Consumer;

public class InventoryItemCardFactory {

    public static InventoryItemCardController createCard(InventoryItemResponse item, boolean isStorekeeperView, Consumer<Integer> addToCartAction) {
        InventoryItemCardController card = new InventoryItemCardController();

        // Set basic information
        card.setItemName(item.getName());
        card.setItemUnit(item.getUnit());
        card.setDescription(item.getDescription());
        card.setId(String.valueOf(item.getId()));

        // Set image
        if (item.getImagePath() != null && !item.getImagePath().isEmpty()) {
            card.setItemImage(item.getImagePath());
        }

        // Set view type (storekeeper or staff)
        card.setStorekeeperView(isStorekeeperView);
        card.setItemId(item.getId());

        // Set storekeeper-specific fields
        if (isStorekeeperView) {
            card.setQuantity(item.getQuantity());
            card.setReorderLevel(item.getReorderLevel());
        }
        
        card.setAddToCartAction(addToCartAction);

        return card;
    }
}