package com.cc.storage.service;

import com.cc.storage.model.UserModel;
import com.cc.storage.model.UserResponseWrapper;
import com.cc.storage.model.VideoModel;
import com.cc.storage.model.dao.VideoDAO;
import com.cc.storage.repository.VideoRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class VideoService {

    private static final Logger logger = LogManager.getLogger();

    @Value("${video.storage.path}")
    private String VIDEO_ROOT_PATH;

    @Value("${gcp.bucket.name}")
    private String BUCKET_NAME;

    @Value("${jwt.secret.token.key}")
    private String JWT_SECRET_TOKEN_KEY;

    @Value("${auth.base.url}")
    private String AUTH_BASE_URL;

    @Value("${monitor.base.url}")
    private String MONITOR_BASE_URL;

    private final Storage storage;
    private final VideoRepo videoRepo;
    private final RestTemplate restTemplate;


    @Autowired
    public VideoService(Storage storage, VideoRepo videoRepo, RestTemplate restTemplate) {
        this.storage = storage;
        this.videoRepo = videoRepo;
        this.restTemplate = restTemplate;
    }



    public ResponseEntity<String> uploadFile(String authorizationHeader, VideoDAO videoDAO, MultipartFile thumbnail, MultipartFile video) {
        try {
            UserModel user = validateToken(authorizationHeader);

            if (video == null || video.isEmpty()) {
                return ResponseEntity.status(400).body("video is empty.");
            }


            if (exceeds50MbSizeLimit(user, video.getBytes().length)) {
                throw new IllegalArgumentException("50 mb limit exceeded.");
            }

            check100MbBandwidthLimit((double) video.getBytes().length / (1024 * 1024));

            uploadVideoAndThumbnail(user, videoDAO, video, thumbnail);


            return ResponseEntity.ok(String.format("Video '%s' uploaded Successfully", videoDAO.getTitle()));
        } catch (Exception e) {
            return manageTokenException(e);
        }
    }

    public ResponseEntity<?> getVideoById(String videoId) {
        try {
            Optional<VideoModel> optionalVideoModel = videoRepo.findById(videoId);

            if (optionalVideoModel.isEmpty()) {
                logger.error("No video found against id: {}", videoId);
                throw new RuntimeException("No video found against id: " + videoId);
            }

            logger.info("Video Path Exists");
            Blob blob = storage.get(BUCKET_NAME, optionalVideoModel.get().getVideoPath());

            if (blob == null) {
                throw new IOException(String.format("Could not return video with id: '%s'!", videoId));
            }
            logger.info("Video Found!");

            InputStream inputStream = new ByteArrayInputStream(blob.getContent());
            InputStreamResource resource = new InputStreamResource(inputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("video/mp4")); // Correct content type for MP4
            headers.setContentDispositionFormData("inline", optionalVideoModel.get().getTitle() + ".mp4");
            headers.setContentLength(blob.getSize());

            logger.info("Video compiled! returning it.");
            return ResponseEntity.status(HttpStatus.OK)
                    .headers(headers)
                    .body(resource);

        } catch (Exception e) {
            return manageTokenException(e);
        }
    }



    public ResponseEntity<List<VideoModel>> getRandomVideos() {
        List<VideoModel> videoModels = videoRepo.findRandomVideos();
        logger.info("Number of videos found: {}", videoModels.size());
        return ResponseEntity.status(200).body(videoModels);
    }

    public ResponseEntity<List<VideoModel>> getAllVideosOfUser(String userId) {
        List<VideoModel> videoModels = videoRepo.findAllByUserId(userId);
        logger.info("Number of videos found: {}", videoModels.size());
        return ResponseEntity.status(200).body(videoModels);
    }

    public ResponseEntity<?> getMyVideos(String authorizationHeader) {
        try {
            UserModel user = validateToken(authorizationHeader);

            List<VideoModel> videoModels = videoRepo.findAllByUserId(user.getId());
            logger.info("Number of videos found: {}", videoModels.size());

            return ResponseEntity.status(200).body(videoModels);

        } catch (Exception e) {
            return manageTokenException(e);
        }
    }


    private ResponseEntity<String> deleteVideo(String authorizationHeader, String videoId) {
        try {
            UserModel user = validateToken(authorizationHeader);

            if (videoId == null || videoId.isEmpty()) {
                logger.error("videoId is empty");
                throw new IllegalArgumentException("Video ID can not be null");
            }

            Optional<VideoModel> videoModel = videoRepo.findById(videoId);
            if (videoModel.isEmpty()) {
                logger.error("videoId not found");
                throw new IllegalArgumentException("No Video found against given Id");
            }

            check100MbBandwidthLimit((double) videoModel.get().getSize() / (1024 * 1024));

            if (videoModel.get().getVideoPath() == null && videoModel.get().getVideoPath().isEmpty()){
                logger.error("Path is empty");
                throw new IllegalArgumentException("Path is empty");
            }

            boolean deleted = storage.delete(BUCKET_NAME, videoModel.get().getVideoPath());

            videoRepo.delete(videoModel.get());
            logger.info("Video '{}' deleted successfully", videoModel.get());

            if (!deleted) {
                throw new IOException(String.format("Could not delete video with id: '%s'!", videoId));
            }

            return ResponseEntity.status(200).body(String.format("Video with id: '%s' for user '%s' deleted successfully!", videoId, user.getUsername()));
        } catch (Exception e) {
            return manageTokenException(e);
        }
    }


    public ResponseEntity<String> deleteMultipleUserVideos(String authorizationHeader, List<String> videoIds) {
        try {
            UserModel user = validateToken(authorizationHeader);

            for (String videoId : videoIds) {
                try {
                    deleteVideo(authorizationHeader, videoId);
                } catch (Exception ignored) {

                }
            }
            return ResponseEntity.status(200).body(String.format("Videos deleted successfully for user '%s'!", user.getUsername()));
        }
        catch (Exception e) {
            return manageTokenException(e);
        }
    }

    public UserModel validateToken(String authorizationHeader) throws IllegalArgumentException, JsonProcessingException {

        logger.info("validating token: {}", authorizationHeader);

        String url = AUTH_BASE_URL + "/api/auth/validateToken";

        // Create an HttpHeaders object to set the Authorization header
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizationHeader);

        // Create an HttpEntity object containing the headers
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Make the API call
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        logger.info("response status received: {}", response.getStatusCode());

        if (response.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            logger.error("unauthorized token");
            throw new IllegalArgumentException("Unauthorized: Missing or invalid Authorization header");
        }

        ObjectMapper mapper = new ObjectMapper();
        UserResponseWrapper userResponseWrapper = mapper.readValue(response.getBody(), UserResponseWrapper.class);

        logger.info("received user response: {}", userResponseWrapper.getUser());
        return userResponseWrapper.getUser();
    }

    public void check100MbBandwidthLimit(double sizeInMB) {
        logger.info("Checking Bandwidth, new video size: {}", sizeInMB);

        String url = MONITOR_BASE_URL + "/api/usage/track";

        // Create a map to hold key-value pairs for the request body
        Map<String, Double> requestBody = new HashMap<>();
        requestBody.put("dataSize", sizeInMB);

        // Make the API call
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestBody, String.class);
        logger.info("response status received: {}", response.getStatusCode());

        if (response.getStatusCode() == HttpStatus.FORBIDDEN) {
            throw new RuntimeException(response.getBody());
        }
    }

    ResponseEntity<String> manageTokenException(Exception e) {
        logger.error(e.getMessage());
        if (e.getMessage().startsWith("Unauthorized")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        if (e.getMessage().startsWith("Daily")) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
        return ResponseEntity.status(409).body(e.getMessage());
    }


    public boolean doesFileExist(String bucketName, String fileName) {
        try {
            Blob blob = storage.get(bucketName, fileName);
            return blob != null && blob.exists();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
    }


    public boolean exceeds50MbSizeLimit(UserModel user, long size) {
        return user.getStorageUsed() + size > 50 *1024 * 1024;
    }


    private void uploadVideoAndThumbnail(UserModel user, VideoDAO videoDAO, MultipartFile video, MultipartFile thumbnail) throws IOException {

        String videoPath = VIDEO_ROOT_PATH + File.separator + user.getId() + File.separator + videoDAO.getTitle();

        if (doesFileExist(BUCKET_NAME, videoPath)) {
            throw new IllegalArgumentException("Video with same title already exists.");
        } logger.info("No Conflict in Video Name");


        BlobInfo blobInfo = BlobInfo.newBuilder(BUCKET_NAME, videoPath).build();
        storage.create(blobInfo, video.getBytes());
        logger.info("Video Uploaded Successfully at {}", videoPath);

        storeVideoData(videoDAO.getTitle(), videoDAO.getDescription(), user.getId(), thumbnail, videoPath, video.getBytes().length);
    }


    private VideoModel storeVideoData(String title, String description, String userId, MultipartFile thumbnail, String videoPath, long size) throws IOException {
        VideoModel videoModel = VideoModel.builder()
                .title(title)
                .description(description)
                .videoPath(videoPath)
                .size(size)
                .userId(userId)
                .build();
        if (thumbnail != null)
            videoModel.setThumbnail(thumbnail.getBytes());

        videoModel = videoRepo.save(videoModel);
        logger.info("Video Data {} saved successfully", videoModel);
        return videoModel;
    }
}
