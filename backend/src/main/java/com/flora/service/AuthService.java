package com.flora.service;

import com.flora.dto.*;
import com.flora.model.Role;
import com.flora.model.User;
import com.flora.repository.RoleRepository;
import com.flora.repository.UserRepository;
import com.flora.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(userDetails);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.findByUsername(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found")));
        
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());
        
        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .provider(user.getProvider() != null ? user.getProvider() : "local")
                .build();
    }
    
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setProvider("local");
        
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.RoleType.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        
        user.setRoles(roles);
        userRepository.save(user);
        
        return new MessageResponse("User registered successfully!");
    }
}
