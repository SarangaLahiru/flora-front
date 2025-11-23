package com.flora.config;

import com.flora.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        // Debug endpoint (remove in production)
                        .requestMatchers("/api/debug/**").authenticated()
                        // Admin endpoints - require ROLE_ADMIN authority
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/reports/**").hasAuthority("ROLE_ADMIN")

                        // Delivery endpoints
                        .requestMatchers("/api/deliveries/tracking/**").permitAll()
                        .requestMatchers("/api/deliveries/order-number/**").permitAll()
                        .requestMatchers("/api/deliveries/order/**").authenticated()
                        .requestMatchers("/api/deliveries/event/**").authenticated()
                        .requestMatchers("/api/deliveries/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/events/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")
                        // Protected endpoints - authentication required
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/wishlist/**").authenticated()
                        // All other requests require authentication
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Parse allowed origins from properties
        String[] origins = allowedOrigins.split(",");
        // Trim whitespace from origins
        for (int i = 0; i < origins.length; i++) {
            origins[i] = origins[i].trim();
        }
        configuration.setAllowedOrigins(Arrays.asList(origins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
