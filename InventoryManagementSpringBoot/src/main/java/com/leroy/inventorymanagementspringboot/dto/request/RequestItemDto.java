package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RequestItemDto {
    private int itemId;
    @Size(min = 1, message = "Quantity can't be 0  or less")
    private int quantity;
}
