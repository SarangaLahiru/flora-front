package com.flora.config;

import com.flora.model.Role;
import com.flora.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role guestRole = new Role();
            guestRole.setName(Role.RoleType.ROLE_GUEST);
            roleRepository.save(guestRole);
            
            Role userRole = new Role();
            userRole.setName(Role.RoleType.ROLE_USER);
            roleRepository.save(userRole);
            
            Role adminRole = new Role();
            adminRole.setName(Role.RoleType.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            System.out.println("Roles initialized successfully!");
        }
    }
}
