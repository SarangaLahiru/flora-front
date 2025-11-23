package com.flora.service;

import com.flora.model.Category;
import com.flora.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        category.setActive(categoryDetails.getActive());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    public List<com.flora.dto.CategoryDTO> getCategoriesWithProductCounts() {
        return categoryRepository.findAll().stream()
                .map(category -> {
                    com.flora.dto.CategoryDTO dto = new com.flora.dto.CategoryDTO();
                    dto.setId(category.getId());
                    dto.setName(category.getName());
                    dto.setDescription(category.getDescription());
                    dto.setImageUrl(category.getImageUrl());
                    dto.setActive(category.getActive());
                    dto.setProductCount((long) category.getProducts().size());
                    dto.setCreatedAt(category.getCreatedAt());
                    dto.setUpdatedAt(category.getUpdatedAt());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
