package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class CreateBatchRequest {
    @JsonProperty("itemName")
    private String itemName;
    
    @JsonProperty("quantity")
    private int quantity;
    
    @JsonProperty("totalPrice")
    private BigDecimal totalPrice;
    
    @JsonProperty("supplierName")
    private String supplierName;
    
    @JsonProperty("invoiceId")
    private String invoiceId;


    public CreateBatchRequest(String itemName, int quantity, BigDecimal totalPrice, String invoiceId, String supplierName) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.supplierName = supplierName;
        this.invoiceId = invoiceId;
    }
    
    public CreateBatchRequest(String itemName, int quantity, BigDecimal totalPrice, String invoiceId){
        this(itemName, quantity, totalPrice, invoiceId, null);
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }
}
