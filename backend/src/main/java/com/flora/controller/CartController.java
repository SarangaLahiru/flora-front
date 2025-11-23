package com.flora.controller;

import com.flora.dto.CartItemRequest;
import com.flora.dto.CartResponse;
import com.flora.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.getCart(username));
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.addToCart(username, request));
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.updateCartItem(username, itemId, quantity));
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long itemId,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.removeFromCart(username, itemId));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        String username = authentication.getName();
        cartService.clearCart(username);
        return ResponseEntity.noContent().build();
    }
}
