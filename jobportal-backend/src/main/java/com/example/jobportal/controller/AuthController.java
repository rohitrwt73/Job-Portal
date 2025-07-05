package com.example.jobportal.controller;

import com.example.jobportal.model.User;
import com.example.jobportal.payload.LoginRequest;
import com.example.jobportal.repository.UserRepository;
import com.example.jobportal.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // 🔐 Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("🔥 ===== LOGIN REQUEST RECEIVED =====");
        System.out.println("📧 Email: " + loginRequest.getEmail());
        System.out.println("🔒 Password Length: " + (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "NULL"));

        try {
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required", "success", false));
            }
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required", "success", false));
            }

            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail().trim());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password", "success", false));
            }

            User user = userOptional.get();

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail().trim(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                    "email", user.getEmail(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "role", user.getRole()
            ));
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password", "success", false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage(), "success", false));
        }
    }

    // 📝 Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        System.out.println("🔥 ===== REGISTRATION REQUEST RECEIVED =====");
        System.out.println("📩 Raw Payload: " + payload);

        try {
            String email = ((String) payload.get("email")).trim();
            String password = (String) payload.get("password");
            String firstName = (String) payload.get("firstName");
            String lastName = (String) payload.get("lastName");
            String role = (String) payload.getOrDefault("role", "USER");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required", "success", false));
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required", "success", false));
            }
            if (firstName == null || firstName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "First name is required", "success", false));
            }
            if (lastName == null || lastName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Last name is required", "success", false));
            }

            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email already exists", "success", false));
            }

            User user = new User();
            user.setEmail(email);
            user.setPassword(new BCryptPasswordEncoder().encode(password));
            user.setFirstName(firstName.trim());
            user.setLastName(lastName.trim());
            user.setRole(role.toUpperCase());

            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "User registered successfully", "success", true));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage(), "success", false));
        }
    }

    // 🧪 Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
                "message", "Auth endpoint is working",
                "timestamp", new Date(),
                "server", "Spring Boot"
        ));
    }
}
