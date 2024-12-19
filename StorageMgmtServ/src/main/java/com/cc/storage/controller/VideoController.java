package com.cc.storage.controller;

import com.cc.storage.model.VideoModel;
import com.cc.storage.model.dao.VideoDAO;
import com.cc.storage.service.VideoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/storage")
public class VideoController {

    private final VideoService userStorageService;

    private static final Logger logger = LogManager.getLogger();

    @Autowired
    public VideoController(VideoService userStorageService) {
        this.userStorageService = userStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String>
    uploadFile(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile thumbnail,
            @RequestParam MultipartFile video
            ) {
        logger.info("/api/storage/upload endpoint called");
        return userStorageService.uploadFile(authorizationHeader, new VideoDAO(title, description), thumbnail, video);
    }

    @GetMapping("/get/{videoId}")
    public ResponseEntity<?>
    getVideoByID(
            @PathVariable String videoId
    ) {
        logger.info("/api/storage/get endpoint called");
        return userStorageService.getVideoById(videoId);
    }

    @DeleteMapping("/delete/{videoId}")
    public ResponseEntity<String>
    deleteFile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable String videoId
    ) {
        logger.info("/api/storage/delete endpoint called");
        return userStorageService.deleteFile(authorizationHeader, videoId);
    }

    @GetMapping("/get-random")
    public ResponseEntity<List<VideoModel>> checkStorageUsage() {
        logger.info("/api/storage/get-random endpoint called");
        return userStorageService.getRandomVideos();
    }

    @GetMapping("/my/videos")
    public ResponseEntity<?> getMyVideos(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader
    ) {
        logger.info("/api/storage/my videos endpoint called");
        return userStorageService.getMyVideos(authorizationHeader);
    }
}
