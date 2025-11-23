package com.flora.controller;

import com.flora.dto.AuthResponse;
import com.flora.dto.GoogleTokenRequest;
import com.flora.dto.LoginRequest;
import com.flora.dto.MessageResponse;
import com.flora.dto.RegisterRequest;
import com.flora.service.AuthService;
import com.flora.service.OAuth2Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private OAuth2Service oAuth2Service;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        MessageResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody GoogleTokenRequest request) {
        try {
            AuthResponse response = oAuth2Service.authenticateWithGoogle(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
