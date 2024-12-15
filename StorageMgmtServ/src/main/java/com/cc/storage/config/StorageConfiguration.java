package com.cc.storage.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class StorageConfiguration {

    @Bean
    public Storage storage() throws IOException {
        String credentialsPath = System.getProperty("gcp.credentials.file.path", "/home/haris/Downloads/semester-project-444606-0287946d09fb.json");
        return StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(new FileInputStream(credentialsPath)))
                .build()
                .getService();
    }

}
