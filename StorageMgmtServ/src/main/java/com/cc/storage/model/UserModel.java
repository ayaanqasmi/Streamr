package com.cc.storage.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserModel {

    private String id;
    private String username;
    private String email;
    private String password;
    private long storageUsed;
    private long dailyBandwidthUsed;
    private String accountStatus;

}