package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "requestId", source = "request.id")
    @Mapping(target = "itemId", source = "inventoryItem.id")
    NotificationResponseDto toDto(Notification notification);
}