package com.flora.repository;

import com.flora.model.Event;
import com.flora.model.Event.EventStatus;
import com.flora.model.Event.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    Optional<Event> findByEventNumber(String eventNumber);
    
    List<Event> findByUserId(Long userId);
    
    List<Event> findByUserIdOrderByEventDateDesc(Long userId);
    
    List<Event> findByStatus(EventStatus status);
    
    List<Event> findByEventType(EventType eventType);
    
    List<Event> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :startDate AND e.eventDate <= :endDate AND e.status = :status")
    List<Event> findUpcomingEvents(@Param("startDate") LocalDate startDate, 
                                   @Param("endDate") LocalDate endDate,
                                   @Param("status") EventStatus status);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.user.id = :userId AND e.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") EventStatus status);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate = :date ORDER BY e.eventTime")
    List<Event> findEventsByDate(@Param("date") LocalDate date);
}
