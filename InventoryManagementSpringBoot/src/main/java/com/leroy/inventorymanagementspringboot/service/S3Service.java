package com.leroy.inventorymanagementspringboot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3Service(
            @Value("${aws.s3.region}") String region,
            @Value("${aws.s3.access-key}") String accessKey,
            @Value("${aws.s3.secret-key}") String secretKey
    ) {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    /**
     * Upload a local File into department "folder" in S3
     */
    public String uploadFile(File localFile, String mimeType, String departmentName) {
        String key = departmentName + "/" + localFile.getName();

        // Upload file
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(mimeType)
                        .build(),
                RequestBody.fromFile(localFile.toPath())
        );

        return buildPublicUrl(key);
    }

    /**
     * Upload a MultipartFile into department "folder" in S3
     */
    public String uploadMultipartFile(MultipartFile multipartFile, String departmentName) throws IOException {
        String key = departmentName + "/" + multipartFile.getOriginalFilename();

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(multipartFile.getContentType())
                        .build(),
                RequestBody.fromBytes(multipartFile.getBytes())
        );

        return buildPublicUrl(key);
    }

    /**
     * Generate public URL for an object
     */
    private String buildPublicUrl(String key) {
        String region = s3Client.serviceClientConfiguration().region().id();
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
}
