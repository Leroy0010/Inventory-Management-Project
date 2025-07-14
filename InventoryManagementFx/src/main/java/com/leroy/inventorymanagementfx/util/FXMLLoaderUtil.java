package com.leroy.inventorymanagementfx.util;

import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.function.Consumer;


public class FXMLLoaderUtil {
    private static final Logger logger = LogManager.getLogger(FXMLLoaderUtil.class);

    public static <T> T load(String fxmlPath, Consumer<Object> controllerConsumer) {
        try {
            URL resource = FXMLLoaderUtil.class.getResource(fxmlPath);
            FXMLLoader loader = new FXMLLoader(resource);
            Node root = loader.load();

            if (controllerConsumer != null) {
                controllerConsumer.accept(loader.getController());
            }

            return (T) root;
        } catch (IOException e) {
            logger.error("Error loading fxml path {}. Error: {}", fxmlPath, Arrays.toString(e.getStackTrace()));
            return null;
        }
    }
}
