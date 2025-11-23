package com.flora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "seasonal_pricing")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeasonalPricing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @NotNull
    @Column(nullable = false)
    private String seasonName;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate endDate;
    
    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAdjustment;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdjustmentType adjustmentType = AdjustmentType.PERCENTAGE;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum AdjustmentType {
        PERCENTAGE,
        FIXED_AMOUNT
    }
}
