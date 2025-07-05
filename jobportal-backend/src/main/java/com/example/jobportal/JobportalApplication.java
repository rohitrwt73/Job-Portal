package com.example.jobportal;

import com.example.jobportal.model.User;
import com.example.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
@SpringBootApplication
public class JobportalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobportalApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            if (!userRepo.existsByEmail("demo@example.com")) {
                User user = new User();
                user.setEmail("demo@example.com");
                user.setFirstName("Demo");      // ✅ UPDATED
                user.setLastName("User");       // ✅ UPDATED
                user.setPassword(encoder.encode("password"));
                user.setRole("USER");
                userRepo.save(user);
            }
        };
    }
}
