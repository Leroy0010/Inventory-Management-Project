package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateInventoryItemRequest {
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("unit")
    private String unit;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("reorderLevel")
    private int reorderLevel;
    
    @JsonProperty("imagePath")
    private String imagePath;

    public CreateInventoryItemRequest(String name, String unit, String description, int reorderLevel, String imagePath) {
        this.name = name;
        this.unit = unit;
        this.description = description;
        this.reorderLevel = reorderLevel;
        this.imagePath = imagePath;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
