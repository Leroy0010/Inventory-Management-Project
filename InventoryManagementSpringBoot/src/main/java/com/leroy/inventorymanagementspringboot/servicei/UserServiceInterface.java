package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdatePasswordRequest;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateProfileRequest;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;


public interface UserServiceInterface {
    UserResponseDto registerAdminOrStoreKeeperByAdmin(RegisterStoreKeeperDto registrationDto);

    UserResponseDto registerStaffByStoreKeeper(RegisterStaffDto registrationDto, UserDetails userDetails);

    List<UserResponseDto> getUsers();

    void setStaffStatus(UserResponseDto staff);
    
    UserResponseDto fetchUserDetails(UserDetails userDetails);
    
    void changePassword(UpdatePasswordRequest updatePasswordRequest, UserDetails userDetails);
    
    UserResponseDto updateProfile(UpdateProfileRequest updateProfileRequest, UserDetails userDetails);
}
