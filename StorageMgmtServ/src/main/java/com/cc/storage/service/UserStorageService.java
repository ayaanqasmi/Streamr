package com.cc.storage.service;

import com.cc.storage.model.UserModel;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class UserStorageService {

    @Value("${file.storage.path}")
    private String storagePath;

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Value("${jwt.secret.token.key}")
    private String JWT_SECRET_TOKEN_KEY;

    private final Storage storage;

    @Autowired
    public UserStorageService(Storage storage) {
        this.storage = storage;
    }

    public ResponseEntity<String> uploadFile(String authorizationHeader, MultipartFile multipartFile) {
        try {
            UserModel user = validateToken(authorizationHeader);

            if (multipartFile == null || multipartFile.isEmpty()) {
                return ResponseEntity.status(400).body("File is empty.");
            }

            String directory = storagePath + File.separator + user.getId();

            if (doesFileExist(bucketName, directory + File.separator + multipartFile.getOriginalFilename()))
                throw new IllegalArgumentException("File already exists.");

            if (exceeds50MbSizeLimit(user, multipartFile.getBytes().length))
                throw new IllegalArgumentException("50 mb limit exceeded.");

            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, directory + File.separator + multipartFile.getOriginalFilename()).build();
            storage.create(blobInfo, multipartFile.getBytes());

            return ResponseEntity.ok(String.format("File '%s' uploaded to storage of '%s'", multipartFile.getOriginalFilename(), user.getUsername()));
        } catch (Exception e) {
            return manageTokenException(e);
        }
    }

    public ResponseEntity<?> getFileByName(String authorizationHeader, String name) {
        try {
            UserModel user = validateToken(authorizationHeader);

            String fullPath = storagePath + File.separator + user.getId() + File.separator + name;

            Blob blob = storage.get(bucketName, fullPath);

            if (blob == null) {
                throw new IOException(String.format("File '%s' not found in storage of '%s'!", name, user.getUsername()));
            }

            return ResponseEntity.status(200).body(blob.getContent());

        } catch (Exception e) {
            return manageTokenException(e);
        }
    }


    public ResponseEntity<String> deleteFile(String authorizationHeader, String name) {
        try {
            UserModel user = validateToken(authorizationHeader);

            String fullPath = storagePath + File.separator + user.getId() + File.separator + name;

            boolean deleted = storage.delete(bucketName, fullPath);

            if (!deleted) {
                throw new IOException(String.format("File '%s' not found in storage of '%s'!", name, user.getUsername()));
            }

            return ResponseEntity.status(200).body(String.format("File '%s' for user '%s' deleted successfully!", name, user.getUsername()));

        } catch (Exception e) {
            return manageTokenException(e);
        }
    }


    public UserModel validateToken(String authorizationHeader) throws IllegalArgumentException{
        if (authorizationHeader == null) {
            throw new IllegalArgumentException("Unauthorized: Token is missing.");
        }
        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Unauthorized: Token is invalid.");
        }

        // Extract the token
        String token = authorizationHeader.substring(7);

        // Parse and validate the JWT token
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET_TOKEN_KEY) // Replace with the same secret key used to sign the token
                .parseClaimsJws(token)
                .getBody();


        // Extract the user object (nested in the payload)
        Map<String, Object> userClaims = claims.get("user", Map.class);

        if (userClaims == null) {
            throw new IllegalArgumentException("Token does not contain user information.");
        }

        return UserModel.builder()
                .id((String) userClaims.get("id"))
                .username((String) userClaims.get("username"))
                .email((String) userClaims.get("email"))
                .storageUsed((long) userClaims.get("storageUsed"))
                .build();
    }

    ResponseEntity<String> manageTokenException(Exception e) {
        e.printStackTrace();
        if (e.getMessage().equals("Unauthorized: Token is missing.") || e.getMessage().equals("Unauthorized: Token is invalid")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        if (e.getMessage().equals("Token does not contain user information.")) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
        return ResponseEntity.status(409).body(e.getMessage());
    }

    public boolean doesFileExist(String bucketName, String fileName) {
        try {
            Blob blob = storage.get(bucketName, fileName);
            return blob != null && blob.exists();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean exceeds50MbSizeLimit(UserModel user, long size) {
        return user.getStorageUsed() + size > 50 *1024 * 1024;
    }

}
