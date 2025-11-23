package com.flora.dto;

import com.flora.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String eventNumber;
    private Event.EventType eventType;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venueName;
    private String venueAddress;
    private String venueCity;
    private String venueState;
    private String venueZipCode;
    private Integer guestCount;
    private BigDecimal budget;
    private String specialInstructions;
    private Event.EventStatus status;
    private BigDecimal totalAmount;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private String rejectionReason;
    private String adminNotes;
    private String approvedByUsername;
    private LocalDateTime approvedAt;
    private Long userId;
    private String userName;
    private List<EventItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private String customizationNotes;
        private String placementLocation;
    }
}
