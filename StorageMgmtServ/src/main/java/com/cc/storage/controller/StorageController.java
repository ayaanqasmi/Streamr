package com.cc.storage.controller;

import com.cc.storage.service.UserStorageService;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    private final UserStorageService userStorageService;



    @Autowired
    public StorageController(UserStorageService userStorageService) {
        this.userStorageService = userStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader, @RequestParam MultipartFile file) throws IOException {
        return userStorageService.uploadFile(authorizationHeader, file);
    }

    @GetMapping("/get/{name}")
    public ResponseEntity<?> getFile(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader, @PathVariable String name) {
        return userStorageService.getFileByName(authorizationHeader, name);
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteFile(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader, @PathVariable String name) throws IOException {
        return userStorageService.deleteFile(authorizationHeader, name);
    }
//
//    @GetMapping("/usage")
//    public double checkStorageUsage(@RequestParam String username) {
//        return storageService.checkStorageUsage(username);
//    }
}
