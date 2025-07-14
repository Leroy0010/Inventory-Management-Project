package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
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
}
