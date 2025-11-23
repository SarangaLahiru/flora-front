package com.flora.controller;

import com.flora.dto.DeliveryRequest;
import com.flora.dto.DeliveryResponse;
import com.flora.model.Delivery;
import com.flora.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> createDelivery(@RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.createDelivery(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<DeliveryResponse> getDeliveryByTracking(@PathVariable String trackingNumber) {
        DeliveryResponse delivery = deliveryService.getDeliveryByTracking(trackingNumber);
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<DeliveryResponse> getDeliveryByOrderNumber(@PathVariable String orderNumber) {
        DeliveryResponse delivery = deliveryService.getDeliveryByOrderNumber(orderNumber);
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByOrder(@PathVariable Long orderId) {
        List<DeliveryResponse> deliveries = deliveryService.getDeliveriesByOrder(orderId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByEvent(@PathVariable Long eventId) {
        List<DeliveryResponse> deliveries = deliveryService.getDeliveriesByEvent(eventId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<DeliveryResponse> deliveries = deliveryService.getDeliveriesByDate(date);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByStatus(@PathVariable Delivery.DeliveryStatus status) {
        List<DeliveryResponse> deliveries = deliveryService.getDeliveriesByStatus(status);
        return ResponseEntity.ok(deliveries);
    }

    @PutMapping("/tracking/{trackingNumber}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> updateDeliveryStatus(@PathVariable String trackingNumber,
            @RequestParam Delivery.DeliveryStatus status) {
        DeliveryResponse delivery = deliveryService.updateDeliveryStatus(trackingNumber, status);
        return ResponseEntity.ok(delivery);
    }

    @PutMapping("/tracking/{trackingNumber}/assign-driver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> assignDriver(@PathVariable String trackingNumber,
            @RequestParam String driverName,
            @RequestParam String driverPhone,
            @RequestParam String vehicleNumber) {
        DeliveryResponse delivery = deliveryService.assignDriver(trackingNumber, driverName, driverPhone,
                vehicleNumber);
        return ResponseEntity.ok(delivery);
    }
}
