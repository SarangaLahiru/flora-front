package com.flora.controller;

import com.flora.dto.ApprovalRequest;
import com.flora.dto.EventRequest;
import com.flora.dto.EventResponse;
import com.flora.dto.RejectionRequest;
import com.flora.model.Event;
import com.flora.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest request,
            Authentication authentication) {
        EventResponse response = eventService.createEvent(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<EventResponse>> getUserEvents(Authentication authentication) {
        List<EventResponse> events = eventService.getUserEvents(authentication.getName());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id,
            Authentication authentication) {
        EventResponse event = eventService.getEventById(id, authentication.getName());
        return ResponseEntity.ok(event);
    }

    @GetMapping("/number/{eventNumber}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<EventResponse> getEventByNumber(@PathVariable String eventNumber) {
        EventResponse event = eventService.getEventByNumber(eventNumber);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<EventResponse> events = eventService.getUpcomingEvents(startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEventStatus(@PathVariable Long id,
            @RequestParam Event.EventStatus status) {
        EventResponse event = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, Authentication authentication) {
        eventService.deleteEvent(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id,
            @RequestBody ApprovalRequest request,
            Authentication authentication) {
        EventResponse event = eventService.approveEvent(id, authentication.getName(), request.getAdminNotes());
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long id,
            @RequestBody RejectionRequest request,
            Authentication authentication) {
        EventResponse event = eventService.rejectEvent(id, authentication.getName(),
                request.getRejectionReason(), request.getAdminNotes());
        return ResponseEntity.ok(event);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        List<EventResponse> events = eventService.getPendingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getEventsByStatus(@PathVariable Event.EventStatus status) {
        List<EventResponse> events = eventService.getEventsByStatus(status);
        return ResponseEntity.ok(events);
    }
}
