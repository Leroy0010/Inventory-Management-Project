package com.leroy.inventorymanagementspringboot.aspect;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.annotation.AuditableList;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.repository.*;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Map;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RequestRepository requestRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InventoryIssuanceRepository inventoryIssuanceRepository;
    private final DepartmentRepository departmentRepository;
    private final OfficeRepository officeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public AuditAspect(
            AuditLogRepository auditLogRepository,
            RequestRepository requestRepository,
            InventoryItemRepository inventoryItemRepository,
            InventoryBatchRepository inventoryBatchRepository,
            InventoryIssuanceRepository inventoryIssuanceRepository,
            DepartmentRepository departmentRepository,
            OfficeRepository officeRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            StockTransactionRepository stockTransactionRepository
    ) {
        this.auditLogRepository = auditLogRepository;
        this.requestRepository = requestRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryBatchRepository = inventoryBatchRepository;
        this.inventoryIssuanceRepository = inventoryIssuanceRepository;
        this.departmentRepository = departmentRepository;
        this.officeRepository = officeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    @Around("@annotation(com.leroy.inventorymanagementspringboot.annotation.Auditable) || " +
            "@annotation(com.leroy.inventorymanagementspringboot.annotation.AuditableList)")
    public Object logAudits(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Auditable[] auditableAnnotations;

        if (method.isAnnotationPresent(AuditableList.class)) {
            auditableAnnotations = method.getAnnotation(AuditableList.class).value();
        } else {
            auditableAnnotations = new Auditable[]{method.getAnnotation(Auditable.class)};
        }

        Object[] args = joinPoint.getArgs();
        User user = extractUser(args);

        Object[] oldStates = Arrays.stream(auditableAnnotations)
                .map(annotation -> annotation.logBefore() ? captureOldState(args, annotation.entityClass()) : null)
                .toArray();

        Object result = joinPoint.proceed();

        for (int i = 0; i < auditableAnnotations.length; i++) {
            Auditable auditable = auditableAnnotations[i];
            Object newState = auditable.logAfter() ? result : null;

            AuditLog log = new AuditLog();
            log.setUser(user);
            log.setAction(auditable.action());
            log.setEntityType(auditable.entityClass().getSimpleName());
            log.setEntityId(resolveEntityId(result));
            log.setOldData(toMap(oldStates[i]));
            log.setNewData(toMap(newState));
            log.setContext(auditable.context());

            auditLogRepository.save(log);
        }

        return result;
    }


    private User extractUser(Object[] args) {
        return Arrays.stream(args)
                .filter(arg -> arg instanceof User)
                .map(arg -> (User) arg)
                .findFirst()
                .orElse(null);
    }

    private Object captureOldState(Object[] args, Class<?> entityClass) {
        for (Object arg : args) {
            try {
                Method getId = arg.getClass().getMethod("getId");
                Object id = getId.invoke(arg);
                if (id != null) {
                    return fetchEntityById(entityClass, id);
                }
            } catch (Exception ignored) {}
        }
        return null;
    }

    private Object fetchEntityById(Class<?> entityClass, Object id) {
        if (entityClass.equals(Request.class)) {
            return requestRepository.findById((Long) id).orElse(null);
        } else if (entityClass.equals(InventoryItem.class)) {
            return inventoryItemRepository.findById((Integer) id).orElse(null);
        } else if (entityClass.equals(InventoryBatch.class)) {
            return inventoryBatchRepository.findById((Long) id).orElse(null);
        } else if (entityClass.equals(InventoryIssuance.class)) {
            return inventoryIssuanceRepository.findById((Long) id).orElse(null);
        } else if (entityClass.equals(Department.class)) {
            return departmentRepository.findById((Integer) id).orElse(null);
        } else if (entityClass.equals(Office.class)) {
            return officeRepository.findById((Integer) id).orElse(null);
        } else if (entityClass.equals(User.class)) {
            return userRepository.findById((Integer) id).orElse(null);
        } else if (entityClass.equals(Role.class)) {
            return roleRepository.findById((Integer) id).orElse(null);
        } else if (entityClass.equals(StockTransaction.class)) {
            return stockTransactionRepository.findById((Long) id).orElse(null);
        }
        return null;
    }

    private Map<String, Object> toMap(Object obj) {
        if (obj == null) return null;
        return objectMapper.convertValue(obj, new TypeReference<>() {});
    }

    private long resolveEntityId(Object result) {
        try {
            Method getId = result.getClass().getMethod("getId");
            return ((Number) getId.invoke(result)).longValue();
        } catch (Exception e) {
            return 0;
        }
    }
}
