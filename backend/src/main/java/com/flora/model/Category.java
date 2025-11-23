package com.flora.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
