package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestItem;
import com.leroy.inventorymanagementspringboot.entity.User;

public interface InventoryIssuanceServiceInterface {

    void fulfillRequestItem(RequestItem requestItem, Request request, User staff);

}
