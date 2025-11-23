package com.flora.controller;

import com.flora.model.Product;
import com.flora.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getActiveProducts();
            return ResponseEntity.ok(products != null ? products : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        try {
            List<Product> products = productService.getFeaturedProducts();
            return ResponseEntity.ok(products != null ? products : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
