package com.flora.service;

import com.flora.dto.OrderRequest;
import com.flora.dto.DeliveryRequest;
import com.flora.model.*;
import com.flora.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DeliveryService deliveryService;

    public Order createOrder(String username, OrderRequest request) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingZipCode(request.getShippingZipCode());
        order.setShippingCountry(request.getShippingCountry());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setPaymentMethod(request.getPaymentMethod());

        // Set payment status based on method
        if ("Cash on Delivery".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
        }

        order.setNotes(request.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            orderItem.setSubtotal(subtotal);

            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(subtotal);

            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Automatically create delivery for the order
        createDeliveryForOrder(savedOrder);

        // Clear cart after order
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    private void createDeliveryForOrder(Order order) {
        try {
            DeliveryRequest deliveryRequest = new DeliveryRequest();
            deliveryRequest.setOrderId(order.getId());
            deliveryRequest.setDeliveryType(Delivery.DeliveryType.STANDARD);

            // Schedule delivery for next day by default
            deliveryRequest.setScheduledDate(LocalDate.now().plusDays(1));
            deliveryRequest.setScheduledTimeSlot("9:00 AM - 5:00 PM");

            // Use order shipping details
            deliveryRequest.setDeliveryAddress(order.getShippingAddress());
            deliveryRequest.setDeliveryCity(order.getShippingCity());
            deliveryRequest.setDeliveryState(order.getShippingState());
            deliveryRequest.setDeliveryZipCode(order.getShippingZipCode());

            // Use customer details as recipient
            String recipientName = order.getUser().getFirstName() != null && order.getUser().getLastName() != null
                    ? order.getUser().getFirstName() + " " + order.getUser().getLastName()
                    : order.getUser().getUsername();
            deliveryRequest.setRecipientName(recipientName);
            deliveryRequest.setRecipientPhone(order.getCustomerPhone());

            // Add order notes as delivery notes
            if (order.getNotes() != null && !order.getNotes().isEmpty()) {
                deliveryRequest.setDeliveryNotes(order.getNotes());
            }

            // Create the delivery (will have PENDING status by default)
            deliveryService.createDelivery(deliveryRequest);
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to create delivery for order " + order.getOrderNumber() + ": " + e.getMessage());
        }
    }

    public List<Order> getUserOrders(String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        return orderRepository.findByUserId(user.getId());
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with order number: " + orderNumber));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
