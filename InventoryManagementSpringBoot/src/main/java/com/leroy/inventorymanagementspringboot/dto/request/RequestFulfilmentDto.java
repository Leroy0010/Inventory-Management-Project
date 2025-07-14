package com.leroy.inventorymanagementspringboot.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RequestFulfilmentDto {
    private long requestId;
    private String requestStatus;
    private boolean fulfilled;
}
