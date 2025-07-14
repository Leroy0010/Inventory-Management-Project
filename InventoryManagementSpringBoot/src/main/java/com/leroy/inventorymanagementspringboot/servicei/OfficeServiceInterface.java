package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateOfficeDto;
import com.leroy.inventorymanagementspringboot.dto.response.OfficeResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Office;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface OfficeServiceInterface {

    @Transactional
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = Office.class
    )
    Office addOffice(CreateOfficeDto office, UserDetails storeKeeper);

    Optional<List<OfficeResponseDto>> getOfficesByDepartment(Department department);
}
