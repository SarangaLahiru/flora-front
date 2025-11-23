package com.flora.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Skip JWT validation for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtTokenProvider.extractUsername(token);
                logger.debug("Extracted username from token: {}", username);
            } catch (Exception e) {
                logger.warn("Failed to extract username from token: {}", e.getMessage());
            }
        } else {
            logger.debug("No Authorization header found or invalid format for: {}", request.getRequestURI());
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtTokenProvider.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Successfully authenticated user: {} with authorities: {}", username, userDetails.getAuthorities());
                } else {
                    logger.warn("Token validation failed for user: {}", username);
                }
            } catch (Exception e) {
                logger.error("Authentication failed for user {}: {}", username, e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
