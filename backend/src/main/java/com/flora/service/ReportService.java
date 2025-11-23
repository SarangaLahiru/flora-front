package com.flora.service;

import com.flora.model.Delivery;
import com.flora.model.Order;
import com.flora.repository.DeliveryRepository;
import com.flora.repository.EventRepository;
import com.flora.repository.OrderRepository;
import com.flora.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

        private final OrderRepository orderRepository;
        private final EventRepository eventRepository;
        private final DeliveryRepository deliveryRepository;
        private final ProductRepository productRepository;

        // Helper method to calculate date range based on period
        private Map<String, LocalDate> calculateDateRange(String period) {
                LocalDate today = LocalDate.now();
                LocalDate startDate;
                LocalDate endDate = today;

                switch (period.toLowerCase()) {
                        case "daily":
                                startDate = today;
                                break;
                        case "weekly":
                                startDate = today.minusDays(today.getDayOfWeek().getValue() - 1); // Start of week
                                                                                                  // (Monday)
                                break;
                        case "yearly":
                                startDate = today.withDayOfYear(1); // Start of year
                                break;
                        case "monthly":
                        default:
                                startDate = today.withDayOfMonth(1); // Start of month
                                break;
                }

                Map<String, LocalDate> range = new HashMap<>();
                range.put("startDate", startDate);
                range.put("endDate", endDate);
                return range;
        }

        // Get sales report by period (daily, weekly, monthly, yearly)
        public Map<String, Object> getSalesReportByPeriod(String period) {
                Map<String, LocalDate> range = calculateDateRange(period);
                return getSalesReport(range.get("startDate"), range.get("endDate"));
        }

        public Map<String, Object> getSalesReport(LocalDate startDate, LocalDate endDate) {
                Map<String, Object> report = new HashMap<>();

                // Get all orders in date range
                List<Order> orders = orderRepository.findAll().stream()
                                .filter(order -> !order.getCreatedAt().toLocalDate().isBefore(startDate)
                                                && !order.getCreatedAt().toLocalDate().isAfter(endDate))
                                .toList();

                BigDecimal totalSales = orders.stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                int totalOrders = orders.size();

                BigDecimal averageOrderValue = totalOrders > 0
                                ? totalSales.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                report.put("startDate", startDate);
                report.put("endDate", endDate);
                report.put("totalSales", totalSales);
                report.put("totalOrders", totalOrders);
                report.put("averageOrderValue", averageOrderValue);
                report.put("orders", orders.stream().map(order -> {
                        Map<String, Object> orderData = new HashMap<>();
                        orderData.put("orderNumber", order.getOrderNumber());
                        orderData.put("date", order.getCreatedAt().toLocalDate());
                        orderData.put("amount", order.getTotalAmount());
                        orderData.put("status", order.getStatus());
                        return orderData;
                }).toList());

                return report;
        }

        public Map<String, Object> getInventoryReport() {
                Map<String, Object> report = new HashMap<>();

                var products = productRepository.findAll();

                long totalProducts = products.size();
                long lowStockProducts = products.stream()
                                .filter(p -> p.getStockQuantity() < 10)
                                .count();
                long outOfStockProducts = products.stream()
                                .filter(p -> p.getStockQuantity() == 0)
                                .count();

                report.put("totalProducts", totalProducts);
                report.put("lowStockProducts", lowStockProducts);
                report.put("outOfStockProducts", outOfStockProducts);
                report.put("products", products.stream().map(product -> {
                        Map<String, Object> productData = new HashMap<>();
                        productData.put("id", product.getId());
                        productData.put("name", product.getName());
                        productData.put("sku", product.getSku());
                        productData.put("stockQuantity", product.getStockQuantity());
                        productData.put("price", product.getPrice());
                        productData.put("status", product.getStockQuantity() == 0 ? "OUT_OF_STOCK"
                                        : product.getStockQuantity() < 10 ? "LOW_STOCK" : "IN_STOCK");
                        return productData;
                }).toList());

                return report;
        }

        // Get delivery report by period
        public Map<String, Object> getDeliveryReportByPeriod(String period) {
                Map<String, LocalDate> range = calculateDateRange(period);

                Map<String, Object> report = new HashMap<>();

                // Get deliveries in the date range
                List<Delivery> deliveries = deliveryRepository.findByScheduledDateBetween(
                                range.get("startDate"), range.get("endDate"));

                long totalDeliveries = deliveries.size();
                long pendingDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.PENDING)
                                .count();
                long scheduledDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.SCHEDULED)
                                .count();
                long completedDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.DELIVERED)
                                .count();

                report.put("period", period);
                report.put("startDate", range.get("startDate"));
                report.put("endDate", range.get("endDate"));
                report.put("totalDeliveries", totalDeliveries);
                report.put("pendingDeliveries", pendingDeliveries);
                report.put("scheduledDeliveries", scheduledDeliveries);
                report.put("completedDeliveries", completedDeliveries);
                report.put("deliveries", deliveries.stream().map(delivery -> {
                        Map<String, Object> deliveryData = new HashMap<>();
                        deliveryData.put("trackingNumber", delivery.getTrackingNumber());
                        deliveryData.put("status", delivery.getStatus());
                        deliveryData.put("timeSlot", delivery.getScheduledTimeSlot());
                        deliveryData.put("recipientName", delivery.getRecipientName());
                        deliveryData.put("address", delivery.getDeliveryAddress());
                        deliveryData.put("driverName", delivery.getDriverName());
                        return deliveryData;
                }).toList());

                return report;
        }

        public Map<String, Object> getDeliveryReport(LocalDate date) {
                Map<String, Object> report = new HashMap<>();

                List<Delivery> deliveries = deliveryRepository.findByScheduledDate(date);

                long totalDeliveries = deliveries.size();
                long pendingDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.PENDING)
                                .count();
                long scheduledDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.SCHEDULED)
                                .count();
                long completedDeliveries = deliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.DELIVERED)
                                .count();

                report.put("date", date);
                report.put("totalDeliveries", totalDeliveries);
                report.put("pendingDeliveries", pendingDeliveries);
                report.put("scheduledDeliveries", scheduledDeliveries);
                report.put("completedDeliveries", completedDeliveries);
                report.put("deliveries", deliveries.stream().map(delivery -> {
                        Map<String, Object> deliveryData = new HashMap<>();
                        deliveryData.put("trackingNumber", delivery.getTrackingNumber());
                        deliveryData.put("status", delivery.getStatus());
                        deliveryData.put("timeSlot", delivery.getScheduledTimeSlot());
                        deliveryData.put("recipientName", delivery.getRecipientName());
                        deliveryData.put("address", delivery.getDeliveryAddress());
                        deliveryData.put("driverName", delivery.getDriverName());
                        return deliveryData;
                }).toList());

                return report;
        }

        public Map<String, Object> getDashboardSummary() {
                Map<String, Object> summary = new HashMap<>();

                LocalDate today = LocalDate.now();
                LocalDate monthStart = today.withDayOfMonth(1);

                // This month's sales
                Map<String, Object> salesReport = getSalesReport(monthStart, today);
                summary.put("monthlySales", salesReport.get("totalSales"));
                summary.put("monthlyOrders", salesReport.get("totalOrders"));

                // Inventory summary
                Map<String, Object> inventoryReport = getInventoryReport();
                summary.put("totalProducts", inventoryReport.get("totalProducts"));
                summary.put("lowStockProducts", inventoryReport.get("lowStockProducts"));

                // Today's deliveries (created today, not scheduled for today)
                List<Delivery> todayDeliveries = deliveryRepository.findByCreatedAtDate(today);
                long pendingCount = todayDeliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.PENDING ||
                                                d.getStatus() == Delivery.DeliveryStatus.SCHEDULED)
                                .count();

                summary.put("todayDeliveries", todayDeliveries.size());
                summary.put("pendingDeliveries", pendingCount);

                // Upcoming events
                long upcomingEvents = eventRepository.findEventsByDate(today).size();
                summary.put("upcomingEvents", upcomingEvents);

                return summary;
        }

        // Get dashboard summary by period
        public Map<String, Object> getDashboardSummaryByPeriod(String period) {
                Map<String, Object> summary = new HashMap<>();
                Map<String, LocalDate> range = calculateDateRange(period);

                // Sales for the period
                Map<String, Object> salesReport = getSalesReport(range.get("startDate"), range.get("endDate"));
                summary.put("periodSales", salesReport.get("totalSales"));
                summary.put("periodOrders", salesReport.get("totalOrders"));
                summary.put("period", period);

                // Inventory summary (doesn't change with period)
                Map<String, Object> inventoryReport = getInventoryReport();
                summary.put("totalProducts", inventoryReport.get("totalProducts"));
                summary.put("lowStockProducts", inventoryReport.get("lowStockProducts"));

                // Deliveries for the period
                List<Delivery> periodDeliveries = deliveryRepository.findByScheduledDateBetween(
                                range.get("startDate"), range.get("endDate"));
                long pendingCount = periodDeliveries.stream()
                                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.PENDING ||
                                                d.getStatus() == Delivery.DeliveryStatus.SCHEDULED)
                                .count();

                summary.put("periodDeliveries", periodDeliveries.size());
                summary.put("pendingDeliveries", pendingCount);

                // Upcoming events
                long upcomingEvents = eventRepository.findEventsByDate(LocalDate.now()).size();
                summary.put("upcomingEvents", upcomingEvents);

                return summary;
        }
}
