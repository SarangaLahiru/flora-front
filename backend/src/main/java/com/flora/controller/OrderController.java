package com.flora.controller;

import com.flora.dto.OrderRequest;
import com.flora.model.Order;
import com.flora.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Order order = orderService.createOrder(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(orderService.getUserOrders(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
