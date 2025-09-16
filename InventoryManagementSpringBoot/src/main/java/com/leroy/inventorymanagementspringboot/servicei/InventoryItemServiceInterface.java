package com.leroy.inventorymanagementspringboot.servicei;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;

public interface InventoryItemServiceInterface {
    InventoryItem addInventoryItem(CreateInventoryItemDto createInventoryItemDto, UserDetails userDetails);

    InventoryItem addInventoryItemWithImage(CreateInventoryItemDto createInventoryItemDto, MultipartFile image, UserDetails userDetails);

    InventoryItem updateInventoryItem(UpdateInventoryItemDto inventoryItem, UserDetails userDetails);

    Optional<List<InventoryItemResponseDto>> getItemsByDepartment(UserDetails userDetails);

    InventoryItemResponseDto deleteInventoryItem(InventoryItemResponseDto inventoryItem, UserDetails userDetails);
}
