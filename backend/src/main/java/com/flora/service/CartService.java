package com.flora.service;

import com.flora.dto.CartItemRequest;
import com.flora.dto.CartItemResponse;
import com.flora.dto.CartResponse;
import com.flora.model.Cart;
import com.flora.model.CartItem;
import com.flora.model.Product;
import com.flora.model.User;
import com.flora.repository.CartItemRepository;
import com.flora.repository.CartRepository;
import com.flora.repository.ProductRepository;
import com.flora.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

        @PersistenceContext
        private EntityManager entityManager;

        @Autowired
        private CartRepository cartRepository;

        @Autowired
        private CartItemRepository cartItemRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private UserRepository userRepository;

        public CartResponse getCart(String username) {
                User user = userRepository.findByEmail(username)
                                .orElseGet(() -> userRepository.findByUsername(username)
                                                .orElseThrow(() -> new RuntimeException("User not found")));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Cart newCart = new Cart();
                                        newCart.setUser(user);
                                        return cartRepository.save(newCart);
                                });

                return convertToCartResponse(cart);
        }

        public CartResponse addToCart(String username, CartItemRequest request) {
                User user = userRepository.findByEmail(username)
                                .orElseGet(() -> userRepository.findByUsername(username)
                                                .orElseThrow(() -> new RuntimeException("User not found")));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Cart newCart = new Cart();
                                        newCart.setUser(user);
                                        return cartRepository.save(newCart);
                                });

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                if (product.getStockQuantity() < request.getQuantity()) {
                        throw new RuntimeException("Insufficient stock");
                }

                CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                                .orElseGet(() -> {
                                        CartItem newItem = new CartItem();
                                        newItem.setCart(cart);
                                        newItem.setProduct(product);
                                        newItem.setQuantity(0);
                                        return newItem;
                                });

                cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
                cartItemRepository.save(cartItem);

                return convertToCartResponse(cart);
        }

        public CartResponse updateCartItem(String username, Long itemId, Integer quantity) {
                User user = userRepository.findByEmail(username)
                                .orElseGet(() -> userRepository.findByUsername(username)
                                                .orElseThrow(() -> new RuntimeException("User not found")));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                CartItem cartItem = cartItemRepository.findById(itemId)
                                .orElseThrow(() -> new RuntimeException("Cart item not found"));

                if (!cartItem.getCart().getId().equals(cart.getId())) {
                        throw new RuntimeException("Unauthorized access to cart item");
                }

                if (quantity <= 0) {
                        cartItemRepository.delete(cartItem);
                        cartItemRepository.flush();
                } else {
                        if (cartItem.getProduct().getStockQuantity() < quantity) {
                                throw new RuntimeException("Insufficient stock");
                        }
                        cartItem.setQuantity(quantity);
                        cartItemRepository.save(cartItem);
                        cartItemRepository.flush();
                }

                // Clear persistence context to force reload
                entityManager.clear();

                // Refresh cart to get updated totals
                cart = cartRepository.findById(cart.getId())
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                return convertToCartResponse(cart);
        }

        public CartResponse removeFromCart(String username, Long itemId) {
                User user = userRepository.findByEmail(username)
                                .orElseGet(() -> userRepository.findByUsername(username)
                                                .orElseThrow(() -> new RuntimeException("User not found")));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                CartItem cartItem = cartItemRepository.findById(itemId)
                                .orElseThrow(() -> new RuntimeException("Cart item not found"));

                if (!cartItem.getCart().getId().equals(cart.getId())) {
                        throw new RuntimeException("Unauthorized access to cart item");
                }

                cartItemRepository.delete(cartItem);
                cartItemRepository.flush();

                // Clear persistence context to force reload
                entityManager.clear();

                // Refresh cart to get updated items list
                cart = cartRepository.findById(cart.getId())
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                return convertToCartResponse(cart);
        }

        public void clearCart(String username) {
                User user = userRepository.findByEmail(username)
                                .orElseGet(() -> userRepository.findByUsername(username)
                                                .orElseThrow(() -> new RuntimeException("User not found")));

                Cart cart = cartRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                cart.getItems().clear();
                cartRepository.save(cart);
        }

        private CartResponse convertToCartResponse(Cart cart) {
                CartResponse response = new CartResponse();
                response.setId(cart.getId());

                List<CartItemResponse> itemResponses = cart.getItems().stream()
                                .map(this::convertToCartItemResponse)
                                .collect(Collectors.toList());

                response.setItems(itemResponses);

                BigDecimal totalAmount = itemResponses.stream()
                                .map(CartItemResponse::getSubtotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                response.setTotalAmount(totalAmount);
                response.setTotalItems(itemResponses.size());

                return response;
        }

        private CartItemResponse convertToCartItemResponse(CartItem item) {
                CartItemResponse response = new CartItemResponse();
                response.setId(item.getId());
                response.setProductId(item.getProduct().getId());
                response.setProductName(item.getProduct().getName());
                response.setProductImage(item.getProduct().getImageUrl());
                response.setProductPrice(item.getProduct().getPrice());
                response.setQuantity(item.getQuantity());

                BigDecimal subtotal = item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()));
                response.setSubtotal(subtotal);

                return response;
        }
}
