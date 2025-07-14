package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateBatchDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryBatchResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryBatch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryBatchMapper {
    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "unitPrice",  ignore = true)
    @Mapping(target = "remainingQuantity",   ignore = true)
    @Mapping(target = "inventoryItem",  ignore = true)
    InventoryBatch toInventoryBatch(CreateBatchDto createBatchDto);

    @Mapping(target = "inventoryItemId", source = "inventoryItem.id")
    @Mapping(target = "inventoryItemName", source = "inventoryItem.name")
    InventoryBatchResponseDto  toInventoryBatchResponseDto(InventoryBatch inventoryBatch);
}
