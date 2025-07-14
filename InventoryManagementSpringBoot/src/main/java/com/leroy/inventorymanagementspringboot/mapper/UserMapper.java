package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto; // New
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementspringboot.dto.response.UserEmailAndIdDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Mapping for UserRegistrationDto (primarily for ADMIN/STOREKEEPER)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordResetToken", ignore = true)
    @Mapping(target = "resetPasswordExpiresAt", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "office", ignore = true) // Will be set manually or left null
    @Mapping(target = "department", ignore = true) // Will be set manually or left null
    @Mapping(target = "active" , ignore = true)
    User toUser(RegisterStoreKeeperDto registerStoreKeeperDto);

    // Mapping for StaffRegistrationDto
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordResetToken", ignore = true)
    @Mapping(target = "resetPasswordExpiresAt", ignore = true)
    @Mapping(target = "role", ignore = true) // Will be set manually (to STAFF)
    @Mapping(target = "office", ignore = true) // Will be set manually
    @Mapping(target = "department", ignore = true) // Will be null for STAFF
    @Mapping(target = "active" , ignore = true)
    User toStaffUser(RegisterStaffDto registerStaffDto);

    @Mapping(target = "jwt", ignore = true)
    @Mapping(target = "role", source = "role.name")
    @Mapping(target = "userId", source = "id")
    AuthenticationResponse toAuthenticationResponse(User user);

    List<UserResponseDto> toUserResponseDtoList(List<User> users);

    @Mapping(target = "officeName", source = "office.name")
    UserResponseDto toUserResponseDto(User user);

    UserEmailAndIdDto toUserEmailAndIdDto(User user);
}