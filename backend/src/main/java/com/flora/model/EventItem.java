package com.flora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "event_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @NotNull
    @Column(nullable = false)
    private Integer quantity;
    
    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String customizationNotes;
    
    private String placementLocation;
}
