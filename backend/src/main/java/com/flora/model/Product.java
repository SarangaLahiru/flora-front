package com.flora.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @JsonIgnoreProperties({ "products", "hibernateLazyInitializer", "handler" })
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String sku;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean featured = false;

    @DecimalMin(value = "0.0")
    @Column(precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
