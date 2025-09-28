package com.leroy.inventorymanagementspringboot.servicei;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;

public interface InventoryItemServiceInterface {
    InventoryItem addInventoryItem(CreateInventoryItemDto createInventoryItemDto, UserDetails userDetails);

    InventoryItem addInventoryItemWithImage(CreateInventoryItemDto createInventoryItemDto, MultipartFile image,
            UserDetails userDetails);

    InventoryItemResponseDto getInventoryItemById(Integer id, UserDetails userDetails);

    InventoryItem updateInventoryItem(Integer id, UpdateInventoryItemDto inventoryItem, UserDetails userDetails);

    List<InventoryItemResponseDto> getItemsByDepartment(UserDetails userDetails);

    void deleteInventoryItem(Integer id, UserDetails userDetails);
}
