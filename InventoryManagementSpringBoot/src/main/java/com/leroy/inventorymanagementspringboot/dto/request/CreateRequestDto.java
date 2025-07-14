package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CreateRequestDto {
    @Size(min = 1, message = "Your request must contain at least an item")
    private List<RequestItemDto>  items;
}
