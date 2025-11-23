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
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String eventNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventItem> eventItems = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @NotNull
    @Column(nullable = false)
    private LocalDate eventDate;

    private LocalTime eventTime;

    private String venueName;

    @Column(columnDefinition = "TEXT")
    private String venueAddress;

    private String venueCity;

    private String venueState;

    private String venueZipCode;

    private Integer guestCount;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(columnDefinition = "TEXT")
    private String specialInstructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PENDING;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    private String contactPerson;

    private String contactPhone;

    private String contactEmail;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum EventType {
        WEDDING,
        BIRTHDAY,
        ANNIVERSARY,
        CORPORATE,
        FUNERAL,
        BABY_SHOWER,
        GRADUATION,
        ENGAGEMENT,
        OTHER
    }

    public enum EventStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
