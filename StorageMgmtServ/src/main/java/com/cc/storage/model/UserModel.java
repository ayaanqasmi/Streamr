package com.cc.storage.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(value = "users")
public class UserModel {

    private String id;

    @NotBlank(message = "Username cannot be blank")
    @Size(max = 50, message = "Username cannot exceed 50 characters")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    @Min(value = 0, message = "Storage used must be 0 or more")
    private long storageUsed;

    @Min(value = 0, message = "Daily bandwidth used must be 0 or more")
    private long dailyBandwidthUsed;

    @NotNull(message = "Account status cannot be null")
    @Pattern(regexp = "^(active|restricted)$", message = "Account status must be 'active' or 'restricted'")
    private String accountStatus;

    @Override
    public String toString() {
        return "USER [" +
                "id=" + id + ", " +
                "username=" + username + ", " +
                "email=" + email + ", " +
                "password=" + password + ", " +
                "storageUsed=" + storageUsed + ", " +
                "dailyBandwidthUsed=" + dailyBandwidthUsed + ", " +
                "accountStatus=" + accountStatus + "]";
    }
}
