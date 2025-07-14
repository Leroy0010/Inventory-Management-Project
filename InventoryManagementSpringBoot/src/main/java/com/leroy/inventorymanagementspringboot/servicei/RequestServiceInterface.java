package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CreateRequestDto;
import com.leroy.inventorymanagementspringboot.dto.request.ApproveRequestDto;
import com.leroy.inventorymanagementspringboot.dto.request.RequestFulfilmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestResponseDto;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface RequestServiceInterface {
    RequestResponseDto createRequest(CreateRequestDto requestDto, UserDetails requester);

    RequestResponseDto approveOrRejectRequest(ApproveRequestDto dto, UserDetails approver);

    RequestResponseDto fulfillRequest(RequestFulfilmentDto dto, UserDetails staff);

    RequestResponseDto submitCartAsRequest(UserDetails user);

    List<RequestResponseDto> getUserRequests(UserDetails userDetails);

    RequestResponseDto getRequestById(Long id, UserDetails userDetails);
}
