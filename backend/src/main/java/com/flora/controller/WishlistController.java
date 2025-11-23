package com.flora.controller;

import com.flora.model.Product;
import com.flora.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        String username = authentication.getName();
        List<Product> wishlist = wishlistService.getUserWishlist(username);
        return ResponseEntity.ok(wishlist);
    }
    
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        String username = authentication.getName();
        wishlistService.addToWishlist(username, productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product added to wishlist");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        String username = authentication.getName();
        wishlistService.removeFromWishlist(username, productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product removed from wishlist");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        String username = authentication.getName();
        boolean isInWishlist = wishlistService.isInWishlist(username, productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isInWishlist", isInWishlist);
        return ResponseEntity.ok(response);
    }
}

