package com.example.realestate.propertyimage;

import com.example.realestate.common.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadLocation;
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/jpg"
    );

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public UploadResult store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        } else {
            extension = ".jpg";
        }

        String storageKey = UUID.randomUUID() + extension;
        Path targetLocation = this.uploadLocation.resolve(storageKey);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + storageKey, ex);
        }

        String fileUrl = "/uploads/" + storageKey;
        return new UploadResult(fileUrl, fileUrl, storageKey);
    }

    public void delete(String storageKey) {
        if (storageKey != null && !storageKey.isBlank()) {
            try {
                Path targetLocation = this.uploadLocation.resolve(storageKey);
                Files.deleteIfExists(targetLocation);
            } catch (IOException ignored) {
            }
        }
    }

    public static class UploadResult {
        private final String url;
        private final String thumbnailUrl;
        private final String storageKey;

        public UploadResult(String url, String thumbnailUrl, String storageKey) {
            this.url = url;
            this.thumbnailUrl = thumbnailUrl;
            this.storageKey = storageKey;
        }

        public String getUrl() { return url; }
        public String getThumbnailUrl() { return thumbnailUrl; }
        public String getStorageKey() { return storageKey; }
    }
}
