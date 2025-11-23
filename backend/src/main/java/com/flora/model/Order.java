package com.flora.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "orders", "cart", "wishlist", "password" })
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({ "order" })
    private List<OrderItem> orderItems = new ArrayList<>();

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private String shippingAddress;

    private String shippingCity;

    private String shippingState;

    private String shippingZipCode;

    private String shippingCountry;

    private String customerPhone;

    private String customerEmail;

    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("order")
    private List<Delivery> deliveries = new ArrayList<>();

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }
}
