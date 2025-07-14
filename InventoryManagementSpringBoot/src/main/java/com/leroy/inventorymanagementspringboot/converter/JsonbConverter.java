package com.leroy.inventorymanagementspringboot.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

@Converter()
public class JsonbConverter implements AttributeConverter<Map<String, Object>, Object> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Object convertToDatabaseColumn(Map<String, Object> attribute) {
        if (attribute == null) return null;

        try {
            PGobject jsonObject = new PGobject();
            jsonObject.setType("jsonb");
            jsonObject.setValue(objectMapper.writeValueAsString(attribute));
            return jsonObject;
        } catch (SQLException | JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting Map to JSONB", e);
        }
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(Object dbData) {
        if (dbData == null) return null;

        try {
            return objectMapper.readValue(dbData.toString(), Map.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error reading JSONB from DB", e);
        }
    }
}
