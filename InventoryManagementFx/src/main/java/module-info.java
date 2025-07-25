module com.leroy.inventorymanagementfx {

// JavaFX Modules
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;
    requires javafx.graphics;
    requires javafx.swing;

// ControlsFX and other UI libraries
    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires net.synedra.validatorfx;
    requires org.kordamp.ikonli.javafx;
    requires org.kordamp.ikonli.fontawesome6;
    requires eu.hansolo.tilesfx;

// Logging (These look correct if the JARs are properly recognized)
    requires org.apache.logging.log4j;
    requires org.apache.logging.log4j.core;

// Standard Java Modules
    requires java.net.http;
    requires java.desktop;
    requires java.sql;

// Spring Framework Modules
    requires spring.websocket;
    requires spring.messaging;
    requires spring.context;
    requires spring.core;
    requires spring.beans;
    requires spring.web;

// Tyrus WebSocket
    requires org.glassfish.tyrus.client;
    requires org.glassfish.tyrus.container.grizzly.client;
    requires org.glassfish.tyrus.core;
    requires org.glassfish.tyrus.spi;

// Jakarta WebSocket API
    requires jakarta.websocket;
    requires jakarta.websocket.client;

// Jackson Modules
    requires com.fasterxml.jackson.databind;
    requires com.fasterxml.jackson.datatype.jsr310;
    requires com.fasterxml.jackson.core;
    requires com.fasterxml.jackson.annotation;

// JWT Modules - use the correct automatic module name
    requires jjwt.api;


// Opens and Exports
    opens com.leroy.inventorymanagementfx to javafx.fxml, com.fasterxml.jackson.databind, spring.core;
    opens com.leroy.inventorymanagementfx.controller to javafx.fxml, com.fasterxml.jackson.databind, spring.core;
    opens com.leroy.inventorymanagementfx.controller.admin to javafx.fxml, com.fasterxml.jackson.databind, spring.core;
    opens com.leroy.inventorymanagementfx.controller.storekeeper to javafx.fxml, com.fasterxml.jackson.databind, spring.core;

    opens com.leroy.inventorymanagementfx.dto.response to com.fasterxml.jackson.databind, javafx.base;
    opens com.leroy.inventorymanagementfx.dto.request to com.fasterxml.jackson.databind;
    opens com.leroy.inventorymanagementfx.dto.report to com.fasterxml.jackson.databind, javafx.base;
    opens com.leroy.inventorymanagementfx.enums to com.fasterxml.jackson.databind, javafx.base;

    opens com.leroy.inventorymanagementfx.service to org.apache.logging.log4j.core;
    opens com.leroy.inventorymanagementfx.service.admin to org.apache.logging.log4j.core;
    opens com.leroy.inventorymanagementfx.service.storekeeper to org.apache.logging.log4j.core;
    opens com.leroy.inventorymanagementfx.service.staff to org.apache.logging.log4j.core;
    opens com.leroy.inventorymanagementfx.service.dashboard to org.apache.logging.log4j.core;

    exports com.leroy.inventorymanagementfx;
    exports com.leroy.inventorymanagementfx.controller;
    exports com.leroy.inventorymanagementfx.interfaces;
    exports com.leroy.inventorymanagementfx.enums;
    exports com.leroy.inventorymanagementfx.service;
    exports com.leroy.inventorymanagementfx.security;
    exports com.leroy.inventorymanagementfx.config;
    exports com.leroy.inventorymanagementfx.service.staff;
    exports com.leroy.inventorymanagementfx.dto.response;
    exports com.leroy.inventorymanagementfx.dto.request;
    exports com.leroy.inventorymanagementfx.service.storekeeper;
    exports com.leroy.inventorymanagementfx.dto.report;
}