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
public class DeliveryRequest {
    
    private Long orderId;
    private Long eventId;
    private Delivery.DeliveryType deliveryType;
    private LocalDate scheduledDate;
    private String scheduledTimeSlot;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryZipCode;
    private String recipientName;
    private String recipientPhone;
    private String deliveryNotes;
}
