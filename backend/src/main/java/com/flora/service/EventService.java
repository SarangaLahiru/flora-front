package com.flora.service;

import com.flora.dto.EventRequest;
import com.flora.dto.EventResponse;
import com.flora.model.Event;
import com.flora.model.EventItem;
import com.flora.model.Product;
import com.flora.model.User;
import com.flora.repository.EventRepository;
import com.flora.repository.ProductRepository;
import com.flora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        Event event = new Event();
        event.setEventNumber(generateEventNumber());
        event.setUser(user);
        event.setEventType(request.getEventType());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setVenueName(request.getVenueName());
        event.setVenueAddress(request.getVenueAddress());
        event.setVenueCity(request.getVenueCity());
        event.setVenueState(request.getVenueState());
        event.setVenueZipCode(request.getVenueZipCode());
        event.setGuestCount(request.getGuestCount());
        event.setBudget(request.getBudget());
        event.setSpecialInstructions(request.getSpecialInstructions());
        event.setContactPerson(request.getContactPerson());
        event.setContactPhone(request.getContactPhone());
        event.setContactEmail(request.getContactEmail());
        event.setStatus(Event.EventStatus.PENDING);

        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (EventRequest.EventItemRequest itemRequest : request.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

                EventItem eventItem = new EventItem();
                eventItem.setEvent(event);
                eventItem.setProduct(product);
                eventItem.setQuantity(itemRequest.getQuantity());
                eventItem.setPrice(product.getPrice());
                eventItem.setCustomizationNotes(itemRequest.getCustomizationNotes());
                eventItem.setPlacementLocation(itemRequest.getPlacementLocation());

                event.getEventItems().add(eventItem);

                BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
                totalAmount = totalAmount.add(itemTotal);
            }
        }

        event.setTotalAmount(totalAmount);

        Event savedEvent = eventRepository.save(event);
        return convertToResponse(savedEvent);
    }

    public List<EventResponse> getUserEvents(String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        List<Event> events = eventRepository.findByUserIdOrderByEventDateDesc(user.getId());
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id, String username) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return convertToResponse(event);
    }

    public EventResponse getEventByNumber(String eventNumber) {
        Event event = eventRepository.findByEventNumber(eventNumber)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToResponse(event);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getUpcomingEvents(LocalDate startDate, LocalDate endDate) {
        List<Event> events = eventRepository.findEventsByDate(startDate);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse updateEventStatus(Long id, Event.EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);

        return convertToResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id, String username) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        eventRepository.delete(event);
    }

    @Transactional
    public EventResponse approveEvent(Long id, String adminUsername, String notes) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User admin = userRepository.findByEmail(adminUsername)
                .orElseGet(() -> userRepository.findByUsername(adminUsername)
                        .orElseThrow(() -> new RuntimeException("Admin not found")));

        event.setStatus(Event.EventStatus.APPROVED);
        event.setApprovedBy(admin);
        event.setApprovedAt(LocalDateTime.now());
        event.setAdminNotes(notes);

        Event updatedEvent = eventRepository.save(event);
        return convertToResponse(updatedEvent);
    }

    @Transactional
    public EventResponse rejectEvent(Long id, String adminUsername, String reason, String notes) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User admin = userRepository.findByEmail(adminUsername)
                .orElseGet(() -> userRepository.findByUsername(adminUsername)
                        .orElseThrow(() -> new RuntimeException("Admin not found")));

        event.setStatus(Event.EventStatus.REJECTED);
        event.setRejectionReason(reason);
        event.setApprovedBy(admin);
        event.setApprovedAt(LocalDateTime.now());
        event.setAdminNotes(notes);

        Event updatedEvent = eventRepository.save(event);
        return convertToResponse(updatedEvent);
    }

    public List<EventResponse> getPendingEvents() {
        List<Event> events = eventRepository.findByStatus(Event.EventStatus.PENDING);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getEventsByStatus(Event.EventStatus status) {
        List<Event> events = eventRepository.findByStatus(status);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private String generateEventNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = eventRepository.count() + 1;
        return String.format("EVT-%s-%04d", datePart, count);
    }

    private EventResponse convertToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setEventNumber(event.getEventNumber());
        response.setEventType(event.getEventType());
        response.setEventDate(event.getEventDate());
        response.setEventTime(event.getEventTime());
        response.setVenueName(event.getVenueName());
        response.setVenueAddress(event.getVenueAddress());
        response.setVenueCity(event.getVenueCity());
        response.setVenueState(event.getVenueState());
        response.setVenueZipCode(event.getVenueZipCode());
        response.setGuestCount(event.getGuestCount());
        response.setBudget(event.getBudget());
        response.setSpecialInstructions(event.getSpecialInstructions());
        response.setStatus(event.getStatus());
        response.setTotalAmount(event.getTotalAmount());
        response.setContactPerson(event.getContactPerson());
        response.setContactPhone(event.getContactPhone());
        response.setContactEmail(event.getContactEmail());
        response.setRejectionReason(event.getRejectionReason());
        response.setAdminNotes(event.getAdminNotes());
        response.setApprovedAt(event.getApprovedAt());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());

        // Set user info
        response.setUserId(event.getUser().getId());
        response.setUserName(event.getUser().getFirstName() != null && event.getUser().getLastName() != null
                ? event.getUser().getFirstName() + " " + event.getUser().getLastName()
                : event.getUser().getUsername());

        // Set approved by username
        if (event.getApprovedBy() != null) {
            response.setApprovedByUsername(event.getApprovedBy().getUsername());
        }

        List<EventResponse.EventItemResponse> items = event.getEventItems().stream()
                .map(item -> {
                    EventResponse.EventItemResponse itemResponse = new EventResponse.EventItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setProductId(item.getProduct().getId());
                    itemResponse.setProductName(item.getProduct().getName());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setPrice(item.getPrice());
                    itemResponse.setCustomizationNotes(item.getCustomizationNotes());
                    itemResponse.setPlacementLocation(item.getPlacementLocation());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(items);

        return response;
    }
}
