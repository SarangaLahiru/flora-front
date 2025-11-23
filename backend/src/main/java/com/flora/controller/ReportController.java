package com.flora.controller;

import com.flora.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reportService.getSalesReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getInventoryReport() {
        Map<String, Object> report = reportService.getInventoryReport();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/deliveries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDeliveryReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> report = reportService.getDeliveryReport(date);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = reportService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    // Period-based endpoints
    @GetMapping("/sales/period/{period}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSalesReportByPeriod(@PathVariable String period) {
        Map<String, Object> report = reportService.getSalesReportByPeriod(period);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/deliveries/period/{period}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDeliveryReportByPeriod(@PathVariable String period) {
        Map<String, Object> report = reportService.getDeliveryReportByPeriod(period);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/dashboard/{period}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardSummaryByPeriod(@PathVariable String period) {
        Map<String, Object> summary = reportService.getDashboardSummaryByPeriod(period);
        return ResponseEntity.ok(summary);
    }
}
