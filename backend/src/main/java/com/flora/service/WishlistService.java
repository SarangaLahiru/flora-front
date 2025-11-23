package com.flora.service;

import com.flora.model.Product;
import com.flora.model.User;
import com.flora.model.Wishlist;
import com.flora.repository.ProductRepository;
import com.flora.repository.UserRepository;
import com.flora.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getUserWishlist(String username) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
        List<Wishlist> wishlists = wishlistRepository.findByUserId(user.getId());
        return wishlists.stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    public void addToWishlist(String username, Long productId) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(String username, Long productId) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public boolean isInWishlist(String username, Long productId) {
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
}
