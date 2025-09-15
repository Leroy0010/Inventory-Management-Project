package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.response.OfficeResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Office;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OfficeMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    Office toOffice(CreateOfficeDto dto);

    @Mapping(target = "staffCount", constant = "0")
    OfficeResponseDto toOfficeResponseDto(Office office);

    List<OfficeResponseDto> toOfficeResponseDtoList(List<Office> offices);
}
