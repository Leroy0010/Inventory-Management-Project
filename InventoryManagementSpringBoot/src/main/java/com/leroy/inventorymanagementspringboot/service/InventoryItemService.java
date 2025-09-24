package com.leroy.inventorymanagementspringboot.service;

import java.io.IOException;
import java.util.*;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateInventoryItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemNameAndIdResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.InventoryItemResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryBatch;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.mapper.InventoryItemMapper;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.InventoryItemServiceInterface;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class InventoryItemService implements InventoryItemServiceInterface {
    final InventoryItemRepository inventoryItemRepository;
    final InventoryItemMapper  inventoryItemMapper;
    private final UserRepository userRepository;
    private final S3Service s3Service;


    public InventoryItemService(InventoryItemRepository inventoryItemRepository, InventoryItemMapper inventoryItemMapper, UserRepository userRepository, S3Service s3Service) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryItemMapper = inventoryItemMapper;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }


    @Override
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = InventoryItem.class
    )
    public InventoryItem addInventoryItem(CreateInventoryItemDto createInventoryItemDto, UserDetails userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (inventoryItemRepository.existsByNameAndDepartment(createInventoryItemDto.getName(), storekeeper.getDepartment())) {
            throw new IllegalArgumentException("Inventory Item already exists");
        }
        InventoryItem inventoryItem = inventoryItemMapper.toInventoryItem(createInventoryItemDto);
        inventoryItem.setDepartment(storekeeper.getDepartment());

        return inventoryItemRepository.save(inventoryItem);
    }

    @Override
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = InventoryItem.class
    )
    public InventoryItem addInventoryItemWithImage(CreateInventoryItemDto createInventoryItemDto, MultipartFile image, UserDetails userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (inventoryItemRepository.existsByNameAndDepartment(createInventoryItemDto.getName(), storekeeper.getDepartment())) {
            throw new IllegalArgumentException("Inventory Item already exists");
        }

        var inventoryItem = inventoryItemMapper.toInventoryItem(createInventoryItemDto);
        inventoryItem.setDepartment(storekeeper.getDepartment());

        // Upload image to Google Drive if provided
        if (image != null && !image.isEmpty()) {
            try {
                String departmentName = storekeeper.getDepartment().getName();
                String imageUrl = s3Service.uploadMultipartFile(image ,departmentName);
                inventoryItem.setImagePath(imageUrl);

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image to Google Drive: " + e.getMessage(), e);
            }
        }

        return inventoryItemRepository.save(inventoryItem);
    }

    @Override
    @Auditable(
            action = AuditAction.UPDATE,
            entityClass = InventoryItem.class,
            logBefore = true
    )
    public InventoryItem updateInventoryItem(long id, UpdateInventoryItemDto inventoryItem, UserDetails  userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if(storekeeper.getDepartment() == null) {
            throw new IllegalArgumentException("Department not found");
        }

        if (!inventoryItemRepository.existsById((int) id)) {
            throw new ResourceNotFoundException("Inventory Item does not exist");
        }

        if (inventoryItemRepository.existsByNameAndDepartmentAndIdNot(inventoryItem.getName(), storekeeper.getDepartment(), (int) id)) {
            throw new IllegalArgumentException("Inventory Item already exists. Try changing the name");
        }

        InventoryItem updatedItem = inventoryItemMapper.toInventoryItemOnUpdate(inventoryItem);
        updatedItem.setDepartment(storekeeper.getDepartment());
        return inventoryItemRepository.save(updatedItem);
    }

    @Override
    public List<InventoryItemResponseDto> getItemsByDepartment(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Department department;
        if (user.getRole().getName().equals("STOREKEEPER"))
            department = user.getDepartment();
        else
            department = user.getOffice().getDepartment();

        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }

        return inventoryItemRepository.findAllByDepartment(department)
                .orElseGet(Collections::emptyList)
                .stream()
                .map(item -> {
                    int totalQuantity = item.getBatches() == null ? 0 :
                            item.getBatches().stream()
                                    .mapToInt(InventoryBatch::getRemainingQuantity)
                                    .sum();

                    // Filter before mapping if STAFF
                    if ("STAFF".equals(user.getRole().getName()) && totalQuantity <= 0) {
                        return null; // will be filtered out
                    }

                    // Delegate mapping to MapStruct, passing quantity
                    return inventoryItemMapper.toInventoryItemResponseDto(item, totalQuantity);
                })
                .filter(Objects::nonNull)
                .toList();
//                .orElseGet(ArrayList::new);
    }


    @Override
    @Auditable(
            action = AuditAction.DELETE,
            entityClass = InventoryItem.class,
            logBefore = true
    )
    public void deleteInventoryItem(long id, UserDetails userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!inventoryItemRepository.existsById((int) id)) {
            throw new IllegalArgumentException("Inventory Item does not exist");
        }

        if(!inventoryItemRepository.existsByIdAndDepartment((int) id, storekeeper.getDepartment())) {
            throw new IllegalCallerException("Item does not exist in your Inventory Collection");
        }
        inventoryItemRepository.deleteById((int) id);

    }

    public InventoryItemResponseDto getInventoryItemById(long id, UserDetails userDetails) {
        User user =  userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Department department;
        if (user.getRole().getName().equals("STOREKEEPER"))
            department = user.getDepartment();
         else
             department = user.getOffice().getDepartment();

        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }

        InventoryItem item = inventoryItemRepository.findByIdAndDepartment((int) id, department).orElseThrow(() -> new EntityNotFoundException("Inventory Item does not exist"));
        InventoryItemResponseDto dto = new InventoryItemResponseDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setUnit(item.getUnit());
        dto.setImagePath(item.getImagePath());
        dto.setReorderLevel(item.getReorderLevel());

        // 👉 Sum up the remaining quantities from batches
        int totalQuantity = item.getBatches() == null ? 0 :
                item.getBatches().stream()
                        .mapToInt(InventoryBatch::getRemainingQuantity)
                        .sum();

        dto.setQuantity(totalQuantity);

        return dto;
    }

    public List<InventoryItemNameAndIdResponseDto> getInventoryItemNameAndId(UserDetails userDetails) {
        User storekeeper =  userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Department department =  storekeeper.getDepartment();
        if (department == null)
            throw new IllegalArgumentException("Department not found");

        var items = inventoryItemRepository.findAllByDepartment(department).orElseGet(ArrayList::new);

        return items
                .stream()
                .map(inventoryItemMapper::toInventoryItemNameAndIdDto).toList();
    }
}
