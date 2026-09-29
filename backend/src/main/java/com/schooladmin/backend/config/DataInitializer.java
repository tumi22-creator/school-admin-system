package com.schooladmin.backend.config;

import com.schooladmin.backend.user.Role;
import com.schooladmin.backend.user.User;
import com.schooladmin.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner seedAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("ADMIN USER CREATED: " + adminEmail);

            } else {
                System.out.println("ADMIN USER ALREADY EXISTS: " + adminEmail);
            }
        };
    }
}