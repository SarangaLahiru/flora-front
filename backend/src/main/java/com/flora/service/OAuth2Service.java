package com.flora.service;

import com.flora.dto.AuthResponse;
import com.flora.dto.GoogleTokenRequest;
import com.flora.dto.GoogleUserInfo;
import com.flora.model.Role;
import com.flora.model.User;
import com.flora.repository.RoleRepository;
import com.flora.repository.UserRepository;
import com.flora.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OAuth2Service {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    
    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleTokenRequest request) {
        try {
            // Verify Google ID Token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                GsonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();
            
            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            
            if (idToken == null) {
                throw new RuntimeException("Invalid ID token");
            }
            
            // Extract user information from token
            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleUserId = payload.getSubject();
            String email = payload.getEmail();
            boolean emailVerified = payload.getEmailVerified();
            String name = (String) payload.get("name");
            String givenName = (String) payload.get("given_name");
            String familyName = (String) payload.get("family_name");
            String pictureUrl = (String) payload.get("picture");
            
            if (!emailVerified) {
                throw new RuntimeException("Email not verified by Google");
            }
            
            // Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                // Create new user
                user = createGoogleUser(googleUserId, email, name, givenName, familyName, pictureUrl);
            } else {
                // Update existing user's Google info if they signed up locally before
                if (user.getProvider() == null || user.getProvider().equals("local")) {
                    user.setProvider("google");
                    user.setProviderId(googleUserId);
                }
                
                // Update avatar and name if not set
                if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
                    user.setAvatarUrl(pictureUrl);
                }
                if ((user.getFirstName() == null || user.getFirstName().isEmpty()) && givenName != null) {
                    user.setFirstName(givenName);
                }
                if ((user.getLastName() == null || user.getLastName().isEmpty()) && familyName != null) {
                    user.setLastName(familyName);
                }
                
                user = userRepository.save(user);
            }
            
            // Generate JWT token
            List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());
            
            String token = jwtTokenProvider.generateToken(user.getEmail(), roles);
            
            return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .provider(user.getProvider())
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage(), e);
        }
    }
    
    private User createGoogleUser(String googleUserId, String email, String name, 
                                   String givenName, String familyName, String pictureUrl) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(generateUniqueUsername(email));
        user.setFirstName(givenName);
        user.setLastName(familyName);
        user.setAvatarUrl(pictureUrl);
        user.setProvider("google");
        user.setProviderId(googleUserId);
        user.setPassword(null); // No password for OAuth users
        user.setActive(true);
        
        // Assign default USER role
        Role userRole = roleRepository.findByName(Role.RoleType.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("User Role not found"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        return userRepository.save(user);
    }
    
    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
}
