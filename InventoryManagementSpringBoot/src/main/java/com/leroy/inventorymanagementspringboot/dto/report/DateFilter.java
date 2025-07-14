package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class DateFilter {
    private Integer year; // e.g., 2025
    private Integer month; // Optional: e.g., 5 for May
    private String from; // Optional ISO date string
    private String to;   // Optional ISO date string
    private String type; // Optional: RECEIVED, ISSUED or null
}