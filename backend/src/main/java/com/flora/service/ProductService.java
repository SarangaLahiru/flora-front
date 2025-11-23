package com.flora.service;

import com.flora.model.Product;
import com.flora.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }
    
    public List<Product> getAvailableProducts() {
        return productRepository.findAvailableProducts();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setSku(productDetails.getSku());
        product.setActive(productDetails.getActive());
        product.setFeatured(productDetails.getFeatured());
        product.setDiscount(productDetails.getDiscount());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
