package com.cc.storage.config;

import org.springframework.http.MediaType;

public class CustomMediaType extends MediaType {
    public static final String VIDEO_MP4 = "video/mp4";
    public static final MediaType VIDEO_MP4_TYPE = new MediaType("video", "mp4");

    public CustomMediaType(String type, String subtype) {
        super(type, subtype);
    }
}
