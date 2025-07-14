package com.leroy.inventorymanagementfx.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

public class ImageStorageService {

    private static final Logger logger = LogManager.getLogger(ImageStorageService.class);

    public Optional<String> saveImage(File sourceFile, String departmentName) {
        try {
            String sanitized = sanitizeDepartmentName(departmentName);
            File storageDir = new File("images/" + sanitized);
            if (!storageDir.exists() && !storageDir.mkdirs()) {
                logger.error("Failed to create department directory: {}", storageDir.getPath());
                return Optional.empty();
            }

            String uniqueFileName = System.currentTimeMillis() + "_" + sourceFile.getName();
            File destination = new File(storageDir, uniqueFileName);
            Files.copy(sourceFile.toPath(), destination.toPath(), StandardCopyOption.REPLACE_EXISTING);

            String relativePath = "images/" + sanitized + "/" + uniqueFileName;
            logger.info("Image saved to: {}", relativePath);
            return Optional.of(relativePath);

        } catch (IOException e) {
            logger.error("Failed to store image", e);
            return Optional.empty();
        }
    }

    public static String sanitizeDepartmentName(String name) {
        return name.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}
