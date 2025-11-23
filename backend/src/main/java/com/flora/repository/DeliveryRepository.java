package com.flora.repository;

import com.flora.model.Delivery;
import com.flora.model.Delivery.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByTrackingNumber(String trackingNumber);

    List<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByEventId(Long eventId);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByScheduledDate(LocalDate date);

    List<Delivery> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT d FROM Delivery d WHERE d.order.user.id = :userId ORDER BY d.scheduledDate DESC")
    List<Delivery> findByUserId(@Param("userId") Long userId);

    @Query("SELECT d FROM Delivery d WHERE d.scheduledDate = :date AND d.status IN :statuses ORDER BY d.scheduledTimeSlot")
    List<Delivery> findScheduledDeliveries(@Param("date") LocalDate date,
            @Param("statuses") List<DeliveryStatus> statuses);

    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.scheduledDate = :date AND d.status = :status")
    Long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") DeliveryStatus status);

    @Query("SELECT d FROM Delivery d WHERE d.order.orderNumber = :orderNumber")
    Optional<Delivery> findByOrderNumber(@Param("orderNumber") String orderNumber);

    @Query("SELECT d FROM Delivery d WHERE DATE(d.createdAt) = :date")
    List<Delivery> findByCreatedAtDate(@Param("date") LocalDate date);
}
