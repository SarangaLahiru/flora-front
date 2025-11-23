package com.flora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String phone;
    private String role; // Primary role (ADMIN/CUSTOMER)
    private Long orderCount;
    private Boolean active;
    private String provider; // local, google
    private LocalDateTime createdAt;
}
