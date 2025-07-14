package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.ApproveRequestDto;
import com.leroy.inventorymanagementspringboot.dto.request.RequestFulfilmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementspringboot.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    private final RequestService requestService;
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<?> createRequest(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(requestService.submitCartAsRequest(userDetails));
    }

    @PutMapping("/approve")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<?> approveOrRejectRequest(@Valid @RequestBody ApproveRequestDto dto, @AuthenticationPrincipal UserDetails storekeeper) {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(requestService.approveOrRejectRequest(dto, storekeeper));
    }

    @PostMapping("/fulfil")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<?> fulfilRequest(@Valid @RequestBody RequestFulfilmentDto dto,@AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(requestService.fulfillRequest(dto, staff));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<List<RequestResponseDto>> getUserRequests(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(requestService.getUserRequests(userDetails));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'STOREKEEPER')") // Adjust roles as needed
    public ResponseEntity<RequestResponseDto> getRequestById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        RequestResponseDto dto = requestService.getRequestById(id, userDetails); // Example: pass userDetails for access control
        return ResponseEntity.ok(dto);
    }
}
