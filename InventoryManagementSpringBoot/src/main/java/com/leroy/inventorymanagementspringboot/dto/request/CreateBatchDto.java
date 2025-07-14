package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter @Getter
public class CreateBatchDto {
    private String itemName;
    @Size(min = 1, message = "Quantity can't be zero or less")
    private int quantity;

    private BigDecimal totalPrice;
    private String supplierName;
    @Size(max = 20)
    private String invoiceId;

}
