package com.leroy.inventorymanagementspringboot.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditableList {
    Auditable[] value();
}
