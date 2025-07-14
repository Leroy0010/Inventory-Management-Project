package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CreateBatchDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryBatchResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface InventoryBatchServiceInterface {
    InventoryBatchResponseDto addInventoryBatch(CreateBatchDto createBatchDto, UserDetails userDetails);

}
