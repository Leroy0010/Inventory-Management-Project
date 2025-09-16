package com.leroy.inventorymanagementspringboot.service;


import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;

@Service
public class GoogleDriveService {

    private final Drive driveService;

    @Value("${google.drive.root-folder-id}") // Main root folder for all departments
    private String rootFolderId;

    public GoogleDriveService(Drive driveService) {
        this.driveService = driveService;
    }

    /**
     * Upload a single file for a department
     * @param localFile The file from local storage
     * @param mimeType The mimeType (e.g., "image/png")
     * @param departmentName The department folder name
     * @return Direct public link to the uploaded file
     */
    public String uploadFile(java.io.File localFile, String mimeType, String departmentName) throws IOException {
        // 1. Ensure department folder exists
        String departmentFolderId = getOrCreateDepartmentFolder(departmentName);

        // 2. File metadata
        File fileMetadata = new File();
        fileMetadata.setName(localFile.getName());
        fileMetadata.setParents(Collections.singletonList(departmentFolderId));

        com.google.api.client.http.FileContent mediaContent =
                new com.google.api.client.http.FileContent(mimeType, localFile);

        // 3. Upload file
        File uploadedFile = driveService.files()
                .create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        // 4. Make file public
        Permission permission = new Permission()
                .setType("anyone")
                .setRole("reader");
        driveService.permissions().create(uploadedFile.getId(), permission).execute();

        // 5. Return direct download link
        return "https://drive.google.com/uc?id=" + uploadedFile.getId();
    }

    /**
     * Upload a MultipartFile for a department
     * @param multipartFile The multipart file from the request
     * @param departmentName The department folder name
     * @return Direct public link to the uploaded file
     */
    public String uploadMultipartFile(MultipartFile multipartFile, String departmentName) throws IOException {
        // 1. Ensure department folder exists
        String departmentFolderId = getOrCreateDepartmentFolder(departmentName);

        // 2. File metadata
        File fileMetadata = new File();
        fileMetadata.setName(multipartFile.getOriginalFilename());
        fileMetadata.setParents(Collections.singletonList(departmentFolderId));

        com.google.api.client.http.ByteArrayContent mediaContent =
                new com.google.api.client.http.ByteArrayContent(
                        multipartFile.getContentType(),
                        multipartFile.getBytes()
                );

        // 3. Upload file
        File uploadedFile = driveService.files()
                .create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        // 4. Make file public
        Permission permission = new Permission()
                .setType("anyone")
                .setRole("reader");
        driveService.permissions().create(uploadedFile.getId(), permission).execute();

        // 5. Return direct download link
        return "https://drive.google.com/uc?id=" + uploadedFile.getId();
    }

    /**
     * Get or create department folder
     */
    private String getOrCreateDepartmentFolder(String departmentName) throws IOException {
        String query = String.format(
                "mimeType='application/vnd.google-apps.folder' and trashed=false and name='%s' and '%s' in parents",
                departmentName, rootFolderId
        );

        FileList result = driveService.files().list()
                .setQ(query)
                .setSpaces("drive")
                .setFields("files(id, name)")
                .execute();

        List<File> files = result.getFiles();

        if (files != null && !files.isEmpty()) {
            return files.getFirst().getId(); // Folder exists
        }

        // Create new folder
        File folderMetadata = new File();
        folderMetadata.setName(departmentName);
        folderMetadata.setMimeType("application/vnd.google-apps.folder");
        folderMetadata.setParents(Collections.singletonList(rootFolderId));

        File folder = driveService.files()
                .create(folderMetadata)
                .setFields("id")
                .execute();

        return folder.getId();
    }
}
