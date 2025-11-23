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
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String trackingNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryType deliveryType = DeliveryType.STANDARD;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate scheduledDate;
    
    private String scheduledTimeSlot;
    
    private LocalDateTime actualDeliveryTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;
    
    private String driverName;
    
    private String driverPhone;
    
    private String vehicleNumber;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;
    
    private String deliveryCity;
    
    private String deliveryState;
    
    private String deliveryZipCode;
    
    private String recipientName;
    
    private String recipientPhone;
    
    @Column(columnDefinition = "TEXT")
    private String deliveryNotes;
    
    private String signatureUrl;
    
    private String photoProofUrl;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal gpsLatitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal gpsLongitude;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum DeliveryType {
        STANDARD,
        EXPRESS,
        SAME_DAY,
        EVENT,
        SCHEDULED
    }
    
    public enum DeliveryStatus {
        PENDING,
        SCHEDULED,
        OUT_FOR_DELIVERY,
        DELIVERED,
        FAILED,
        RETURNED,
        CANCELLED
    }
}
