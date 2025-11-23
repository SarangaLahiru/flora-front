package com.flora.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "wishlists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(unique = true, nullable = false)
    private String uniqueKey;
    
    @PrePersist
    protected void onCreate() {
        if (uniqueKey == null) {
            uniqueKey = user.getId() + "_" + product.getId();
        }
    }
}

