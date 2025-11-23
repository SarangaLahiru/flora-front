package com.flora.service;

import com.flora.model.User;
import com.flora.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.flora.repository.OrderRepository orderRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setCity(userDetails.getCity());
        user.setState(userDetails.getState());
        user.setZipCode(userDetails.getZipCode());
        user.setCountry(userDetails.getCountry());

        return userRepository.save(user);
    }

    @Autowired
    private com.flora.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.flora.repository.CartRepository cartRepository;

    public void deleteUser(Long id) {
        User user = getUserById(id);

        // Delete related data first
        wishlistRepository.deleteByUserId(id);
        cartRepository.deleteByUserId(id);

        userRepository.delete(user);
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.getActive());
        return userRepository.save(user);
    }

    public List<com.flora.dto.UserDTO> getUsersWithOrderCounts() {
        return userRepository.findAll().stream()
                .map(user -> {
                    com.flora.dto.UserDTO dto = new com.flora.dto.UserDTO();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setEmail(user.getEmail());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setAvatarUrl(user.getAvatarUrl());
                    dto.setPhone(user.getPhone());
                    dto.setActive(user.getActive());
                    dto.setProvider(user.getProvider());
                    dto.setCreatedAt(user.getCreatedAt());

                    // Get primary role
                    String role = user.getRoles().stream()
                            .map(r -> r.getName().name())
                            .filter(name -> name.equals("ROLE_ADMIN"))
                            .findFirst()
                            .orElse("ROLE_USER");
                    dto.setRole(role.replace("ROLE_", ""));

                    // Count orders
                    dto.setOrderCount(orderRepository.countByUserId(user.getId()));

                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
