package com.example.jobportal.service;

import com.example.jobportal.model.User;
import com.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("=== LOADING USER BY EMAIL ===");
        System.out.println("Email: " + email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                System.out.println("User not found with email: " + email);
                return new UsernameNotFoundException("User not found with email: " + email);
            });

        System.out.println("User found: " + user.getEmail());
        System.out.println("User role: " + user.getRole());
        System.out.println("Password encoded: " + (user.getPassword() != null && !user.getPassword().isEmpty()));

        String role = user.getRole() != null ? user.getRole() : "USER";
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        
        System.out.println("UserDetails created successfully");
        return userDetails;
    }
}