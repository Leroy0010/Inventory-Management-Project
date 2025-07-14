module com.leroy.inventorymanagementfx {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;
    requires javafx.graphics; // Explicitly added, often needed by UI frameworks

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx; // Updated to .core if that's what you're using
    requires net.synedra.validatorfx;
    requires org.kordamp.ikonli.javafx;
    requires eu.hansolo.tilesfx;
    requires com.fasterxml.jackson.annotation;
    requires jjwt.api;
    requires org.apache.logging.log4j.core;
    requires org.apache.logging.log4j;
    requires java.net.http; // For HttpClient (if you use it for REST)
    requires com.fasterxml.jackson.databind;
    requires java.desktop; // For SystemTray, AWT components
    requires org.kordamp.ikonli.fontawesome6;
    // REMOVE THIS: This is for the old Java-WebSocket client
    // requires org.java_websocket;
    requires java.sql; // If you interact with JDBC directly

    // Spring WebSocket Client Modules
    requires spring.websocket;
    requires spring.messaging;
    requires spring.context;

    // Tyrus WebSocket Client Modules - BOTH ARE IMPORTANT
    requires org.glassfish.tyrus.client;
    requires org.glassfish.tyrus.container.grizzly.client; // RE-ADDED THIS ONE
    requires jakarta.websocket.client;
    requires com.fasterxml.jackson.datatype.jsr310;
    requires spring.web; // Explicitly require the API module

    // Opens and Exports
    opens com.leroy.inventorymanagementfx to javafx.fxml;
    exports com.leroy.inventorymanagementfx;
    exports com.leroy.inventorymanagementfx.controller;
    opens com.leroy.inventorymanagementfx.controller to javafx.fxml;
    exports com.leroy.inventorymanagementfx.interfaces;
    exports com.leroy.inventorymanagementfx.enums;
    exports com.leroy.inventorymanagementfx.service;
    exports com.leroy.inventorymanagementfx.security;
    exports com.leroy.inventorymanagementfx.config;
    exports com.leroy.inventorymanagementfx.service.staff;
    exports com.leroy.inventorymanagementfx.dto.response; // Make sure this path is correct for your DTOs
    exports com.leroy.inventorymanagementfx.dto.request;
    exports com.leroy.inventorymanagementfx.service.storekeeper;
    exports com.leroy.inventorymanagementfx.service.admin;

    // Add this for Log4j2 to configure itself if it's external to your module
    // This is a common JPMS issue with logging frameworks
    opens com.leroy.inventorymanagementfx.service to org.apache.logging.log4j.core; // If you have loggers in service package
    // Add other packages where you use Log4j2 and need reflection for configuration
}