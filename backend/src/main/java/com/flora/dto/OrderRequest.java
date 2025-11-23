package com.flora.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    @NotBlank(message = "City is required")
    private String shippingCity;
    
    @NotBlank(message = "State is required")
    private String shippingState;
    
    @NotBlank(message = "Zip code is required")
    private String shippingZipCode;
    
    @NotBlank(message = "Country is required")
    private String shippingCountry;
    
    @NotBlank(message = "Phone is required")
    private String customerPhone;
    
    @NotBlank(message = "Email is required")
    private String customerEmail;
    
    private String paymentMethod;
    private String notes;
}
