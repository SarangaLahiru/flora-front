package com.flora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserInfo {
    private String sub;          // Google user ID
    private String email;
    private Boolean emailVerified;
    private String name;
    private String givenName;    // First name
    private String familyName;   // Last name
    private String picture;      // Avatar URL
    private String locale;
}
