package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.response.OfficeResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Office;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.OfficeService;
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
@RequestMapping("/api/offices")
public class OfficeController {

    private final OfficeService  officeService;
    private final UserRepository userRepository;

    public OfficeController(OfficeService officeService, UserRepository userRepository) {
        this.officeService = officeService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<Office> addOffice(@Valid @RequestBody CreateOfficeDto officeDto, @AuthenticationPrincipal UserDetails authenticatedUser) {
        Office office = officeService.addOffice(officeDto, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(office);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<Optional<List<OfficeResponseDto>>> getAllOffices(@AuthenticationPrincipal UserDetails authenticatedUser) {
        User user = userRepository.findByEmail(authenticatedUser.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not not found"));
        return ResponseEntity.status(HttpStatus.OK).body(officeService.getOfficesByDepartment(user.getDepartment()));
    }

    @GetMapping("/names")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<?> getOfficeNames(@AuthenticationPrincipal UserDetails authenticatedUser) {
        try {
            User storeKeeper = userRepository.findByEmail(authenticatedUser.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not not found"));
            Optional<List<String>> officeNames = Optional.of(officeService
                    .getOfficesByDepartment(storeKeeper.getDepartment())
                    .get()
                    .stream()
                    .map(OfficeResponseDto::getName).toList());
            return ResponseEntity.status(HttpStatus.OK).body(officeNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
