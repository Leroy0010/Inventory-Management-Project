package com.leroy.inventorymanagementspringboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync // Enable asynchronous method execution
@EnableScheduling
public class InventoryManagementSpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryManagementSpringBootApplication.class, args);
    }

}
