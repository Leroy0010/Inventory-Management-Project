package com.leroy.inventorymanagementspringboot.service;

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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InventoryItemService implements InventoryItemServiceInterface {
    final InventoryItemRepository inventoryItemRepository;
    final InventoryItemMapper  inventoryItemMapper;
    private final UserRepository userRepository;

    public InventoryItemService(InventoryItemRepository inventoryItemRepository, InventoryItemMapper inventoryItemMapper, UserRepository userRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryItemMapper = inventoryItemMapper;
        this.userRepository = userRepository;
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
            action = AuditAction.UPDATE,
            entityClass = InventoryItem.class,
            logBefore = true
    )
    public InventoryItem updateInventoryItem(UpdateInventoryItemDto inventoryItem, UserDetails  userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if(storekeeper.getDepartment() == null) {
            throw new IllegalArgumentException("Department not found");
        }

        if (!inventoryItemRepository.existsById(inventoryItem.getId())) {
            throw new ResourceNotFoundException("Inventory Item does not exist");
        }

        if (inventoryItemRepository.existsByNameAndDepartmentAndIdNot(inventoryItem.getName(), storekeeper.getDepartment(), inventoryItem.getId())) {
            throw new IllegalArgumentException("Inventory Item already exists. Try changing the name");
        }

        InventoryItem updatedItem = inventoryItemMapper.toInventoryItemOnUpdate(inventoryItem);
        updatedItem.setDepartment(storekeeper.getDepartment());
        return inventoryItemRepository.save(updatedItem);
    }

    @Override
    public Optional<List<InventoryItemResponseDto>> getItemsByDepartment(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Department department;
        if (user.getRole().getName().equals("STOREKEEPER"))
            department = user.getDepartment();
        else
            department = user.getOffice().getDepartment();

        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }

        Optional<List<InventoryItem>> inventoryItemsOpt = inventoryItemRepository.findAllByDepartment(department);

        return inventoryItemsOpt.map(inventoryItems -> inventoryItems.stream().map(item -> {
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
        }).toList());
    }


    @Override
    @Auditable(
            action = AuditAction.DELETE,
            entityClass = InventoryItem.class,
            logBefore = true
    )
    public InventoryItemResponseDto deleteInventoryItem(InventoryItemResponseDto inventoryItem, UserDetails userDetails) {
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!inventoryItemRepository.existsById(inventoryItem.getId())) {
            throw new IllegalArgumentException("Inventory Item does not exist");
        }

        if(!inventoryItemRepository.existsByIdAndDepartment(inventoryItem.getId(), storekeeper.getDepartment())) {
            throw new IllegalCallerException("Item does not exist in your Inventory Collection");
        }
        inventoryItemRepository.deleteById(inventoryItem.getId());

        return inventoryItem;
    }

    public InventoryItemResponseDto getInventoryItemById(int id, UserDetails userDetails) {
        User user =  userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Department department;
        if (user.getRole().getName().equals("STOREKEEPER"))
            department = user.getDepartment();
         else
             department = user.getOffice().getDepartment();

        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }

        InventoryItem item = inventoryItemRepository.findByIdAndDepartment(id, department).orElseThrow(() -> new EntityNotFoundException("Inventory Item does not exist"));
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

    public Optional<List<InventoryItemNameAndIdResponseDto>> getInventoryItemNameAndId(UserDetails userDetails) {
        User storekeeper =  userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Department department =  storekeeper.getDepartment();
        if (department == null)
            throw new IllegalArgumentException("Department not found");

        var items = inventoryItemRepository.findAllByDepartment(department);

        return items
                .map(itemsDto -> itemsDto.stream().map(inventoryItemMapper::toInventoryItemNameAndIdDto).toList());
    }
}
