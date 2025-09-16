package com.leroy.inventorymanagementspringboot.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleDriveConfig {

    @Value("${google.drive.credentials-file}")
    private String credentialsFilePath;

    @Bean
    public Drive googleDrive() throws IOException, GeneralSecurityException {
        var credentials = (ServiceAccountCredentials) ServiceAccountCredentials
                .fromStream(new FileInputStream(credentialsFilePath))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                jsonFactory,
                new HttpCredentialsAdapter(credentials))
                .setApplicationName("Inventory Management")
                .build();
    }
}