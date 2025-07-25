package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemNameAndIdResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.service.InventoryItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory-items")
public class InventoryItemController {
    private final InventoryItemService inventoryItemService;

    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryItem> addInventoryItem(@Valid @RequestBody CreateInventoryItemDto inventoryItem, @AuthenticationPrincipal UserDetails storekeeper) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryItemService.addInventoryItem(inventoryItem, storekeeper));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryItem> updateInventoryItem(@Valid @RequestBody UpdateInventoryItemDto inventoryItem, @AuthenticationPrincipal UserDetails storekeeper) {
        return ResponseEntity.status(HttpStatus.OK).body(inventoryItemService.updateInventoryItem(inventoryItem, storekeeper));
    }

    @GetMapping("/get-all-department-names")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<Optional<List<String>>> getInventoryItemNamesByDepartment(@AuthenticationPrincipal UserDetails user
    ) {
        Optional<List<String>> itemNames = inventoryItemService.getItemsByDepartment(user)
                .map(item  -> item.stream().map(InventoryItemResponseDto::getName).toList());
        return ResponseEntity.status(HttpStatus.OK).body(itemNames);
    }

    @GetMapping("/get-all-department")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<Optional<List<InventoryItemNameAndIdResponseDto>>> getInventoryItemsByDepartment(@AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(inventoryItemService.getInventoryItemNameAndId(user));
    }

    @DeleteMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryItemResponseDto> deleteInventoryItem(@Valid @RequestBody InventoryItemResponseDto inventoryItem, @AuthenticationPrincipal UserDetails storekeeper) {
        return ResponseEntity.status(HttpStatus.OK).body(inventoryItemService.deleteInventoryItem(inventoryItem, storekeeper));
    }

    @GetMapping("/get-by-id/{id}")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<InventoryItemResponseDto> getInventoryItemById(@Valid @PathVariable int id,  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(inventoryItemService.getInventoryItemById(id, userDetails));
    }

    @GetMapping("/get-item-name-id")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<Optional<List<InventoryItemNameAndIdResponseDto>>> getInventoryItemNameAndId(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(inventoryItemService.getInventoryItemNameAndId(userDetails));
        } catch (EntityNotFoundException exception){
            throw new EntityNotFoundException(exception.getMessage());
        }
    }
}
