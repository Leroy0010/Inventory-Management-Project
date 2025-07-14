package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface InventoryItemServiceInterface {
    InventoryItem addInventoryItem(CreateInventoryItemDto createInventoryItemDto, UserDetails userDetails);

    InventoryItem updateInventoryItem(UpdateInventoryItemDto inventoryItem, UserDetails userDetails);

    Optional<List<InventoryItemResponseDto>> getItemsByDepartment(UserDetails userDetails);

    InventoryItemResponseDto deleteInventoryItem(InventoryItemResponseDto inventoryItem, UserDetails userDetails);
}
