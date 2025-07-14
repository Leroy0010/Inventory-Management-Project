package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemNameAndIdResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryItemMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    InventoryItem toInventoryItem(CreateInventoryItemDto createInventoryItemDto);

    @Mapping(target = "department", ignore = true)
    InventoryItem toInventoryItemOnUpdate(UpdateInventoryItemDto updateInventoryItemDto);

    InventoryItemNameAndIdResponseDto toInventoryItemNameAndIdDto(InventoryItem inventoryItem);

}
