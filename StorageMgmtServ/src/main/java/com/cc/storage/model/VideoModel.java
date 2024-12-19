package com.cc.storage.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Document(value = "videos")
public class VideoModel {

    @Id
    private String id;

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 5, max = 255, message = "Title must be 5 - 255 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 1000, message = "Description must be 10 - 1000 characters")
    private String description;

    @NotBlank(message = "video path cannot be blank")
    private String videoPath;

    @Min(value = 1, message = "Size must be greater than 0 bytes")
    private long size;

    @NotNull(message = "User Id can not be null")
    private String userId;

    private byte[] thumbnail;

    @Override
    public String toString() {
        return "VIDEO MODEL [" +
                "id: " + this.id + ", " +
                "title: " + this.title + ", " +
                "description: " + this.description +
                ", videoPath: " + this.videoPath + ", " +
                "size: " + this.size + ", " +
                "userId: " + this.userId +
                "]";
    }

}
