package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateInventoryItemRequest {
    private final int id;
    private final String name;
    private final String description;
    private final String unit;
    private final String imagePath;
    private final int reorderLevel;

    @JsonCreator
    public UpdateInventoryItemRequest(
            @JsonProperty("id") int id,
            @JsonProperty("name") String name,
            @JsonProperty("description") String description,
            @JsonProperty("unit") String unit,
            @JsonProperty("imagePath") String imagePath,
            @JsonProperty("reorderLevel") int reorderLevel) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.imagePath = imagePath;
        this.reorderLevel = reorderLevel;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getUnit() {
        return unit;
    }

    public String getImagePath() {
        return imagePath;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }
}