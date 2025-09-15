package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.response.OfficeResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Office;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.mapper.OfficeMapper;
import com.leroy.inventorymanagementspringboot.repository.OfficeRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.OfficeServiceInterface;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OfficeService implements OfficeServiceInterface {
    private final OfficeRepository officeRepository;
    private final OfficeMapper officeMapper;
    private final UserRepository userRepository;

    public OfficeService(OfficeRepository officeRepository, OfficeMapper officeMapper, UserRepository userRepository) {
        this.officeRepository = officeRepository;
        this.officeMapper = officeMapper;
        this.userRepository = userRepository;
    }

    @Transactional
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = Office.class
    )
    @Override
    public Office addOffice(CreateOfficeDto office, UserDetails storeKeeper) {

        User user = userRepository.findByEmail(storeKeeper.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(officeRepository.existsByNameAndDepartment(office.getName(), user.getDepartment())) {
            throw new IllegalArgumentException("An office with that name already exists in your department.");

        }

        Office registeredOffice = officeMapper.toOffice(office);

        registeredOffice.setDepartment(user.getDepartment());

        return officeRepository.save(registeredOffice);
    }

    @Override
    public Optional<List<OfficeResponseDto>> getOfficesByDepartment(Department department) {
        if (department == null) {
            throw new IllegalArgumentException("Department cannot be null.");
        }
        Optional<List<Office>> offices = officeRepository.findAllByDepartment(department);
        return offices.map(officeMapper::toOfficeResponseDtoList);
    }

    @Transactional
    @Auditable(
            action = AuditAction.UPDATE,
            entityClass = Office.class
    )
    public Office updateOffice(int officeId, UpdateOfficeDto updateOfficeDto, UserDetails storeKeeper) {
        User user = userRepository.findByEmail(storeKeeper.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new RuntimeException("Office not found"));

        // Check if office belongs to user's department
        if (!office.getDepartment().equals(user.getDepartment())) {
            throw new IllegalArgumentException("You can only update offices in your department.");
        }

        // Check if name is being changed and if new name already exists
        if (!office.getName().equals(updateOfficeDto.getName()) && 
            officeRepository.existsByNameAndDepartment(updateOfficeDto.getName(), user.getDepartment())) {
            throw new IllegalArgumentException("An office with that name already exists in your department.");
        }

        office.setName(updateOfficeDto.getName());
        office.setLocation(updateOfficeDto.getLocation());
        office.setDescription(updateOfficeDto.getDescription());

        return officeRepository.save(office);
    }

    @Transactional
    @Auditable(
            action = AuditAction.DELETE,
            entityClass = Office.class
    )
    public void deleteOffice(int officeId, UserDetails storeKeeper) {
        User user = userRepository.findByEmail(storeKeeper.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new RuntimeException("Office not found"));

        // Check if office belongs to user's department
        if (!office.getDepartment().equals(user.getDepartment())) {
            throw new IllegalArgumentException("You can only delete offices in your department.");
        }

        // Check if office has staff members
        long staffCount = userRepository.countByOffice(office);
        if (staffCount > 0) {
            throw new IllegalArgumentException("Cannot delete office with existing staff members.");
        }

        officeRepository.delete(office);
    }

    public OfficeResponseDto getOfficeWithStaffCount(int officeId, UserDetails storeKeeper) {
        User user = userRepository.findByEmail(storeKeeper.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new RuntimeException("Office not found"));

        // Check if office belongs to user's department
        if (!office.getDepartment().equals(user.getDepartment())) {
            throw new IllegalArgumentException("You can only view offices in your department.");
        }

        long staffCount = userRepository.countByOffice(office);
        OfficeResponseDto responseDto = officeMapper.toOfficeResponseDto(office);
        responseDto.setStaffCount((int) staffCount);
        return responseDto;
    }
}
