package com.cc.storage.model;

import lombok.Data;

@Data
public class UserResponseWrapper {

    private UserModel user;

    private long iat;

    private long exp;

}
