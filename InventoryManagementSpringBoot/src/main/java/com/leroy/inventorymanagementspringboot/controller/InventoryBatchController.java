package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateBatchDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryBatchResponseDto;
import com.leroy.inventorymanagementspringboot.service.InventoryBatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/batch")
public class InventoryBatchController {
    private final InventoryBatchService inventoryBatchService;

    public InventoryBatchController(InventoryBatchService inventoryBatchService) {
        this.inventoryBatchService = inventoryBatchService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryBatchResponseDto> addInventoryBatch(@Valid @RequestBody CreateBatchDto createBatchDto, @AuthenticationPrincipal UserDetails storeKeeper) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(inventoryBatchService.addInventoryBatch(createBatchDto, storeKeeper));
    }
}
