package com.flora.dto;

import com.flora.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    
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
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private List<EventItemRequest> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventItemRequest {
        private Long productId;
        private Integer quantity;
        private String customizationNotes;
        private String placementLocation;
    }
}
