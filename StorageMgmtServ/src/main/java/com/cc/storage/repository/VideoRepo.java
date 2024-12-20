package com.cc.storage.repository;

import com.cc.storage.model.UserModel;
import com.cc.storage.model.VideoModel;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepo extends MongoRepository<VideoModel, String> {

    List<VideoModel> findByTitle(String title);

    List<VideoModel> findAllByUserId(@NotNull(message = "User Id can not be null") String userId);

    @Aggregation(pipeline = { "{ $sample: { size: 30 } }" })
    List<VideoModel> findRandomVideos();

    void deleteAllByUserId(@NotNull(message = "User Id can not be null") String userId);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $group: { _id: null, totalSize: { $sum: \"$size\" } } }"
    })
    Long calculateTotalStorageUsedByUser(String userId);

}
