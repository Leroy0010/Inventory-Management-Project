package com.leroy.inventorymanagementfx.config;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Properties;

public class Config {
    private static final String CONFIG_FILE = "config.properties";
    private static final Properties properties = new Properties();
    private static final Logger logger = LogManager.getLogger(Config.class);

    static {
        try (InputStream input = Config.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                System.err.println("Unable to load config.properties");
                logger.error("Unable to load config.properties");
            }
            properties.load(input);
        } catch (IOException ex) {
            logger.error("IO Error which loading config.properties{}", Arrays.toString(ex.getStackTrace()));

        }
    }

    public static String getBackendUrl() {
        return properties.getProperty("backend.url");
    }

    public static String getJwtTSecret(){
        return properties.getProperty("jwt.secret");
    }

    public static String getGoogleClientId(){
        return properties.getProperty("google.clientid");
    }

    public static String getGoogleRedirectUri(){
        return properties.getProperty("google.redirecturi");
    }

    public static String getGoogleClientSecret() {
        return properties.getProperty("google.client.secret");
    }
    
    public static String getWebSocketURL() {
        return properties.getProperty("WEBSOCKET_URL");
    }
}

