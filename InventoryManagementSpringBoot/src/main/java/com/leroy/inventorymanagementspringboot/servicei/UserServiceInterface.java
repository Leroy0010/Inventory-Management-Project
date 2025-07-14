package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserServiceInterface {
    User registerAdminOrStoreKeeperByAdmin(RegisterStoreKeeperDto registrationDto);

    User registerStaffByStoreKeeper(RegisterStaffDto registrationDto, UserDetails userDetails);

    Optional<List<UserResponseDto>> getUsersByDepartment(Department department);

    void setStaffStatus(UserResponseDto staff);



}
