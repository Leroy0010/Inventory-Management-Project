package com.leroy.inventorymanagementspringboot.annotation;

import com.leroy.inventorymanagementspringboot.enums.AuditAction;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(AuditableList.class)
public @interface Auditable {
    AuditAction action();
    Class<?> entityClass();
    String context() default "";
    boolean logBefore() default false;
    boolean logAfter() default true;
}
