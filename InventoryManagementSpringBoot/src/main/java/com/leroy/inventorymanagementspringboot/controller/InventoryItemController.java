package com.leroy.inventorymanagementspringboot.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemNameAndIdResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.service.InventoryItemService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

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

    @PostMapping(value = "/with-image", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryItem> addInventoryItemWithImage(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("unit") String unit,
            @RequestParam("reorderLevel") int reorderLevel,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails storekeeper) {
        
        CreateInventoryItemDto inventoryItem = new CreateInventoryItemDto();
        inventoryItem.setName(name);
        inventoryItem.setDescription(description);
        inventoryItem.setUnit(unit);
        inventoryItem.setReorderLevel(reorderLevel);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryItemService.addInventoryItemWithImage(inventoryItem, image, storekeeper));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventoryItem> updateInventoryItem(@Valid @RequestBody UpdateInventoryItemDto inventoryItem, @PathVariable long id, @AuthenticationPrincipal UserDetails storekeeper) {
        return ResponseEntity.status(HttpStatus.OK).body(inventoryItemService.updateInventoryItem(id, inventoryItem, storekeeper));
    }

    @GetMapping("/get-all-department-names")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<List<String>> getInventoryItemNamesByDepartment(@AuthenticationPrincipal UserDetails user
    ) {
        List<String> itemNames = inventoryItemService
                .getItemsByDepartment(user)
                .stream()
                .map(InventoryItemResponseDto::getName).toList();
        return ResponseEntity.status(HttpStatus.OK).body(itemNames);
    }

    @GetMapping("/get-all-department")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<List<InventoryItemResponseDto>> getInventoryItemsByDepartment(@AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(inventoryItemService.getItemsByDepartment(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<String> deleteInventoryItem(@Valid @PathVariable long id ,@AuthenticationPrincipal UserDetails storekeeper) {
        inventoryItemService.deleteInventoryItem(id, storekeeper);
        return ResponseEntity.status(HttpStatus.OK).body("Item deleted");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('STOREKEEPER', 'STAFF')")
    public ResponseEntity<InventoryItemResponseDto> getInventoryItemById(@Valid @PathVariable long id,  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(inventoryItemService.getInventoryItemById(id, userDetails));
    }

    @GetMapping("/get-item-name-id")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<InventoryItemNameAndIdResponseDto>> getInventoryItemNameAndId(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(inventoryItemService.getInventoryItemNameAndId(userDetails));
        } catch (EntityNotFoundException exception){
            throw new EntityNotFoundException(exception.getMessage());
        }
    }
}
