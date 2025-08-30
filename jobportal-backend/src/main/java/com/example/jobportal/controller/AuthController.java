package com.example.jobportal.controller;

import com.example.jobportal.model.User;
import com.example.jobportal.service.UserDetailsServiceImpl;
import com.example.jobportal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import com.example.jobportal.payload.RegistrationRequest; // Import the new DTO

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        try {
            // Create a User object from the DTO and set properties
            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setFirstName(registrationRequest.getFirstName());
            user.setLastName(registrationRequest.getLastName());
            user.setPassword(registrationRequest.getPassword()); // Password will be encoded in UserDetailsServiceImpl
            user.setRole(registrationRequest.getRole());

            userDetailsService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            // Include the registered user's essential details in the response
            response.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "role", user.getRole()));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Fetch the full User object to include in the response
        User authenticatedUser = userDetailsService.findByEmail(user.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found after authentication"));

        Map<String, Object> response = new HashMap<>();
        response.put("jwt", jwt);
        response.put("user", Map.of(
                "id", authenticatedUser.getId(),
                "email", authenticatedUser.getEmail(),
                "firstName", authenticatedUser.getFirstName(),
                "lastName", authenticatedUser.getLastName(),
                "role", authenticatedUser.getRole()));

        return ResponseEntity.ok(response);
    }
}
