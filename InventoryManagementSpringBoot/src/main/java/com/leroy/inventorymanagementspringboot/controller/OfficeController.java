package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateOfficeDto;
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

    private final OfficeService officeService;
    private final UserRepository userRepository;

    public OfficeController(OfficeService officeService, UserRepository userRepository) {
        this.officeService = officeService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<String> addOffice(@Valid @RequestBody CreateOfficeDto officeDto,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        officeService.addOffice(officeDto, authenticatedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Office created");
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<OfficeResponseDto>> getAllOffices(
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        User user = userRepository.findByEmail(authenticatedUser.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        List<OfficeResponseDto> offices = officeService.getOfficesByDepartment(user.getDepartment()).orElse(List.of());

        // Add staff count for each office
        for (OfficeResponseDto office : offices) {
            long staffCount = userRepository.countByOfficeId(office.getId());
            office.setStaffCount((int) staffCount);
        }

        return ResponseEntity.ok(offices);
    }

    @GetMapping("/names")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<String>> getOfficeNames(@AuthenticationPrincipal UserDetails authenticatedUser) {
        try {
            User storeKeeper = userRepository.findByEmail(authenticatedUser.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not not found"));

            Optional<List<OfficeResponseDto>> offices = officeService
                    .getOfficesByDepartment(storeKeeper.getDepartment());

            if (offices.isEmpty()) {
                return ResponseEntity.ok(List.of()); // Return an empty list if no offices are found
            }

            List<String> officeNames = offices.get().stream()
                    .map(OfficeResponseDto::getName)
                    .toList();

            return ResponseEntity.status(HttpStatus.OK).body(officeNames);
        } catch (Exception e) {
            // You should handle this more gracefully, but for now, this works.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<OfficeResponseDto> getOfficeById(@PathVariable Integer id,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        OfficeResponseDto office = officeService.getOfficeWithStaffCount(id, authenticatedUser);
        return ResponseEntity.ok(office);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<Office> updateOffice(@PathVariable Integer id, @Valid @RequestBody UpdateOfficeDto officeDto,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        Office office = officeService.updateOffice(id, officeDto, authenticatedUser);
        return ResponseEntity.ok(office);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<?> deleteOffice(@PathVariable Integer id,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        officeService.deleteOffice(id, authenticatedUser);
        return ResponseEntity.ok().build();
    }
}
