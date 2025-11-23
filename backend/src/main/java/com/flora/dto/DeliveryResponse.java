package com.flora.dto;

import com.flora.model.Delivery;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    
    private Long id;
    private String trackingNumber;
    private Long orderId;
    private String orderNumber;
    private Long eventId;
    private String eventNumber;
    private Delivery.DeliveryType deliveryType;
    private LocalDate scheduledDate;
    private String scheduledTimeSlot;
    private LocalDateTime actualDeliveryTime;
    private Delivery.DeliveryStatus status;
    private String driverName;
    private String driverPhone;
    private String vehicleNumber;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryZipCode;
    private String recipientName;
    private String recipientPhone;
    private String deliveryNotes;
    private String signatureUrl;
    private String photoProofUrl;
    private BigDecimal gpsLatitude;
    private BigDecimal gpsLongitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
