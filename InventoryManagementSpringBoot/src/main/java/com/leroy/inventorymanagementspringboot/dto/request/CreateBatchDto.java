package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter @Getter
public class CreateBatchDto {
    private String itemName;
    @Min(value = 1, message = "Quantity can't be zero or less")
    private int quantity;
    private BigDecimal totalPrice;
    private String supplierName;
    @Size(min = 3, max = 20)
    private String invoiceId;

}
