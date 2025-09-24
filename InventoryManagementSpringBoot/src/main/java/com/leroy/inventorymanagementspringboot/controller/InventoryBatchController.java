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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
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

    @GetMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<InventoryBatchResponseDto>> getAllInventoryBatches(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(inventoryBatchService.getAllInventoryBatches(userDetails));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryBatchResponseDto> getAllInventoryBatches(@PathVariable long id) {
        return ResponseEntity.ok(inventoryBatchService.getInventoryBatchById(id));
    }


}
