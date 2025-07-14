package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateRequestDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestItemResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestStatusHistoryDto;
import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestItem;
import com.leroy.inventorymanagementspringboot.entity.RequestStatusHistory;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class}) // Ensure UserMapper is used
public interface RequestMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "requestStatus", ignore = true)
    @Mapping(target = "submittedAt", ignore = true)
    @Mapping(target = "approvedAt",  ignore = true)
    @Mapping(target = "approver",  ignore = true)
    @Mapping(target = "fulfilledAt", ignore = true)
    @Mapping(target = "fulfiller", ignore = true)
    @Mapping(target = "statusHistory", ignore = true)
    @Mapping(target = "user", source = "requester")
    Request toRequest(CreateRequestDto dto, User requester);

    @Mapping(target = "user_id", source = "user.id")
    @Mapping(target = "status", source = "requestStatus.name")
    // Explicitly map approver and fulfiller through UserMapper
    @Mapping(target = "approver", source = "approver") // MapStruct will automatically use UserMapper.toUserResponseDto
    @Mapping(target = "fulfilledAt", source = "fulfilledAt")
    @Mapping(target = "fulfiller", source = "fulfiller") // MapStruct will automatically use UserMapper.toUserResponseDto
    RequestResponseDto toRequestResponseDto(Request request);

    @Mapping(target = "name", source = "item.name")
    RequestItemResponseDto toRequestItemResponseDto(RequestItem item);

    @Mapping(target = "statusName", source = "status.name")
    @Mapping(target = "changedBy", source = "changedBy") // MapStruct will use UserMapper.toUserResponseDto here
    @Mapping(target = "timestamp", source = "changedAt")
    RequestStatusHistoryDto toRequestStatusHistoryDto(RequestStatusHistory history);

    @AfterMapping
    default void enrichRequestResponseDto(Request request, @MappingTarget RequestResponseDto dto) {
        if (request.getItems() != null) {
            List<RequestItemResponseDto> itemDtos = request.getItems().stream()
                    .map(this::toRequestItemResponseDto)
                    .toList();
            dto.setItems(itemDtos);
        }

        if (request.getStatusHistory() != null) {
            List<RequestStatusHistoryDto> historyDtos = request.getStatusHistory().stream()
                    .map(this::toRequestStatusHistoryDto)
                    .sorted((h1, h2) -> { // Sort by timestamp for chronological order
                        if (h1.getTimestamp() == null && h2.getTimestamp() == null) return 0;
                        if (h1.getTimestamp() == null) return -1; // nulls first, or adjust as needed
                        if (h2.getTimestamp() == null) return 1;
                        return h1.getTimestamp().compareTo(h2.getTimestamp());
                    })
                    .collect(Collectors.toList());
            dto.setStatusHistory(historyDtos);
        }
    }
}