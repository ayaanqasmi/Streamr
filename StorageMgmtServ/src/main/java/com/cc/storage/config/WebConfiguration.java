package com.cc.storage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Collections;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        // Allow requests from your frontend (adjust URL and port as needed)
//        registry.addMapping("/**")
//                .allowedOrigins("http://127.0.0.1:5500")  // Your frontend's origin
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")  // Allow any headers
//                .allowCredentials(true);  // Allow credentials if needed (like cookies or authentication tokens)
//    }

}
