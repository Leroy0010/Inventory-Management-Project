package com.leroy.inventorymanagementfx.security;

import javafx.application.Platform;
import javafx.beans.property.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public final class UserSession {
    private static final Logger logger = LogManager.getLogger(UserSession.class);
    private static final String SESSION_FILE = "user_session.properties";
    private static final Path SESSION_FILE_PATH = Paths.get(SESSION_FILE);

    private static class Holder {
        static final UserSession INSTANCE = new UserSession();
    }

    private final IntegerProperty id = new SimpleIntegerProperty();
    private final StringProperty firstName = new SimpleStringProperty();
    private final StringProperty role = new SimpleStringProperty();
    private final BooleanProperty authenticated = new SimpleBooleanProperty(false);

    private UserSession() {
        loadSession(); // Load any existing session on creation
    }

    public static UserSession getInstance() {
        return Holder.INSTANCE;
    }

    public void initializeSession(Integer id, String firstName, String role) {
        Platform.runLater(() -> {
            this.id.set(id);
            this.firstName.set(firstName);
            this.role.set(role);
            this.authenticated.set(true);
            saveSession();
            logger.info("Session initialized for user {} (ID: {}, Role: {})", firstName, id, role);
        });
    }

    public void saveSession() {
        Properties props = new Properties();
        if (isAuthenticated()) {
            props.setProperty("id", String.valueOf(id.get()));
            props.setProperty("firstName", firstName.get());
            props.setProperty("role", role.get());
            props.setProperty("authenticated", "true");
        }

        try (OutputStream output = Files.newOutputStream(Paths.get(SESSION_FILE))) {
            props.store(output, "User Session Data");
            logger.debug("Session data saved to {}", SESSION_FILE);
        } catch (IOException e) {
            logger.error("Failed to save session to {}: {}", SESSION_FILE, e.getMessage(), e);
        }
    }

    private void loadSession() {
        if (!Files.exists(SESSION_FILE_PATH)) {
            logger.debug("No existing session file found at {}", SESSION_FILE);
            return;
        }

        Properties props = new Properties();
        try (InputStream input = Files.newInputStream(SESSION_FILE_PATH)) {
            props.load(input);

            if ("true".equals(props.getProperty("authenticated"))) {
                
                id.set(Integer.parseInt(props.getProperty("id")));
                firstName.set(props.getProperty("firstName"));
                role.set(props.getProperty("role"));
                authenticated.set(true);
                
                logger.info("Loaded existing session for user {} (ID: {}, Role: {})",
                        props.getProperty("firstName"),
                        props.getProperty("id"),
                        props.getProperty("role"));
            }
        } catch (IOException e) {
            logger.error("Failed to load session from {}: {}", SESSION_FILE, e.getMessage(), e);
            clearSessionFile();
        } catch (NumberFormatException e) {
            logger.error("Invalid ID format in session file: {}", e.getMessage(), e);
            clearSessionFile();
        }
    }

    private void clearSessionFile() {
        try {
            Files.deleteIfExists(SESSION_FILE_PATH);
            logger.debug("Session file {} cleared", SESSION_FILE);
        } catch (IOException e) {
            logger.error("Failed to clear session file {}: {}", SESSION_FILE, e.getMessage(), e);
        }
    }

    public void clearSession() {
        Platform.runLater(() -> {
            id.set(0);
            firstName.set(null);
            role.set(null);
            authenticated.set(false);
            clearSessionFile();
            logger.info("User session cleared");
        });
    }
    

    public StringProperty firstNameProperty() {
        return firstName;
    }

    public StringProperty roleProperty() {
        return role;
    }

    public ReadOnlyBooleanProperty authenticatedProperty() {
        return authenticated;
    }

    public String getFirstName() {
        return firstName.get();
    }

    public String getRole() {
        return role.get();
    }

    public boolean isAuthenticated() {
        return authenticated.get();
    }
    
    public int getId () {return id.get();}
    
    
}
