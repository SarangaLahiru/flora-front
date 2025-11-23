package com.flora.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleTokenRequest {
    @NotBlank(message = "ID token is required")
    private String idToken;
    
    private String accessToken;
}
