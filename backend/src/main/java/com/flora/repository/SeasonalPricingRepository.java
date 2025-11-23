package com.flora.repository;

import com.flora.model.SeasonalPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SeasonalPricingRepository extends JpaRepository<SeasonalPricing, Long> {
    
    List<SeasonalPricing> findByProductId(Long productId);
    
    List<SeasonalPricing> findByActiveTrue();
    
    @Query("SELECT sp FROM SeasonalPricing sp WHERE sp.product.id = :productId " +
           "AND sp.startDate <= :date AND sp.endDate >= :date AND sp.active = true")
    List<SeasonalPricing> findActiveSeasonalPricing(@Param("productId") Long productId, 
                                                    @Param("date") LocalDate date);
    
    @Query("SELECT sp FROM SeasonalPricing sp WHERE sp.startDate <= :date AND sp.endDate >= :date AND sp.active = true")
    List<SeasonalPricing> findAllActiveForDate(@Param("date") LocalDate date);
}
