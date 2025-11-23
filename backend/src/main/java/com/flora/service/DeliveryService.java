package com.flora.service;

import com.flora.dto.DeliveryRequest;
import com.flora.dto.DeliveryResponse;
import com.flora.exception.ResourceNotFoundException;
import com.flora.model.Delivery;
import com.flora.model.Event;
import com.flora.model.Order;
import com.flora.repository.DeliveryRepository;
import com.flora.repository.EventRepository;
import com.flora.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;

    @Transactional
    public DeliveryResponse createDelivery(DeliveryRequest request) {
        Delivery delivery = new Delivery();
        delivery.setTrackingNumber(generateTrackingNumber());

        if (request.getOrderId() != null) {
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            delivery.setOrder(order);
        }

        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
            delivery.setEvent(event);
        }

        delivery.setDeliveryType(request.getDeliveryType());
        delivery.setScheduledDate(request.getScheduledDate());
        delivery.setScheduledTimeSlot(request.getScheduledTimeSlot());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        delivery.setDeliveryCity(request.getDeliveryCity());
        delivery.setDeliveryState(request.getDeliveryState());
        delivery.setDeliveryZipCode(request.getDeliveryZipCode());
        delivery.setRecipientName(request.getRecipientName());
        delivery.setRecipientPhone(request.getRecipientPhone());
        delivery.setDeliveryNotes(request.getDeliveryNotes());
        delivery.setStatus(Delivery.DeliveryStatus.PENDING);

        Delivery savedDelivery = deliveryRepository.save(delivery);
        return convertToResponse(savedDelivery);
    }

    public DeliveryResponse getDeliveryByTracking(String trackingNumber) {
        Delivery delivery = deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        return convertToResponse(delivery);
    }

    public DeliveryResponse getDeliveryByOrderNumber(String orderNumber) {
        Delivery delivery = deliveryRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found for order: " + orderNumber));
        return convertToResponse(delivery);
    }

    public List<DeliveryResponse> getDeliveriesByOrder(Long orderId) {
        List<Delivery> deliveries = deliveryRepository.findByOrderId(orderId);
        return deliveries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getDeliveriesByEvent(Long eventId) {
        List<Delivery> deliveries = deliveryRepository.findByEventId(eventId);
        return deliveries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getDeliveriesByDate(LocalDate date) {
        List<Delivery> deliveries = deliveryRepository.findByScheduledDate(date);
        return deliveries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getDeliveriesByStatus(Delivery.DeliveryStatus status) {
        List<Delivery> deliveries = deliveryRepository.findByStatus(status);
        return deliveries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryResponse updateDeliveryStatus(String trackingNumber, Delivery.DeliveryStatus status) {
        Delivery delivery = deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

        delivery.setStatus(status);

        if (status == Delivery.DeliveryStatus.DELIVERED) {
            delivery.setActualDeliveryTime(LocalDateTime.now());
        }

        Delivery updatedDelivery = deliveryRepository.save(delivery);
        return convertToResponse(updatedDelivery);
    }

    @Transactional
    public DeliveryResponse assignDriver(String trackingNumber, String driverName, String driverPhone,
            String vehicleNumber) {
        Delivery delivery = deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setDriverName(driverName);
        delivery.setDriverPhone(driverPhone);
        delivery.setVehicleNumber(vehicleNumber);
        delivery.setStatus(Delivery.DeliveryStatus.SCHEDULED);

        Delivery updatedDelivery = deliveryRepository.save(delivery);
        return convertToResponse(updatedDelivery);
    }

    private String generateTrackingNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        // Use a random 6-digit number to ensure uniqueness and avoid count() issues
        int randomPart = (int) (Math.random() * 900000) + 100000;
        return String.format("TRK-%s-%d", datePart, randomPart);
    }

    private DeliveryResponse convertToResponse(Delivery delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setId(delivery.getId());
        response.setTrackingNumber(delivery.getTrackingNumber());

        if (delivery.getOrder() != null) {
            response.setOrderId(delivery.getOrder().getId());
            response.setOrderNumber(delivery.getOrder().getOrderNumber());
        }

        if (delivery.getEvent() != null) {
            response.setEventId(delivery.getEvent().getId());
            response.setEventNumber(delivery.getEvent().getEventNumber());
        }

        response.setDeliveryType(delivery.getDeliveryType());
        response.setScheduledDate(delivery.getScheduledDate());
        response.setScheduledTimeSlot(delivery.getScheduledTimeSlot());
        response.setActualDeliveryTime(delivery.getActualDeliveryTime());
        response.setStatus(delivery.getStatus());
        response.setDriverName(delivery.getDriverName());
        response.setDriverPhone(delivery.getDriverPhone());
        response.setVehicleNumber(delivery.getVehicleNumber());
        response.setDeliveryAddress(delivery.getDeliveryAddress());
        response.setDeliveryCity(delivery.getDeliveryCity());
        response.setDeliveryState(delivery.getDeliveryState());
        response.setDeliveryZipCode(delivery.getDeliveryZipCode());
        response.setRecipientName(delivery.getRecipientName());
        response.setRecipientPhone(delivery.getRecipientPhone());
        response.setDeliveryNotes(delivery.getDeliveryNotes());
        response.setSignatureUrl(delivery.getSignatureUrl());
        response.setPhotoProofUrl(delivery.getPhotoProofUrl());
        response.setGpsLatitude(delivery.getGpsLatitude());
        response.setGpsLongitude(delivery.getGpsLongitude());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());

        return response;
    }
}
