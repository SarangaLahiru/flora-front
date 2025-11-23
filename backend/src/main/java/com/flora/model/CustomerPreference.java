package com.flora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPreference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String favoriteFlowers;
    
    @Column(columnDefinition = "TEXT")
    private String allergies;
    
    @Column(columnDefinition = "TEXT")
    private String preferredColors;
    
    @Column(columnDefinition = "TEXT")
    private String occasionReminders;
    
    @Column(columnDefinition = "TEXT")
    private String deliveryInstructions;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
