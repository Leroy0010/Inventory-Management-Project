package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestItemResponseDto {
    private int id;
    private String name;
    private int quantity;
}
