package com.example.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.example.jobportal.model.Job;
import com.example.jobportal.repository.JobRepository;
import com.github.javafaker.Faker;

import java.util.stream.IntStream;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@EnableJpaRepositories(basePackages = "com.example.jobportal.repository")
public class JobportalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobportalApplication.class, args);
    }

    @Bean
    public CommandLineRunner demoData(JobRepository jobRepository) {
        return args -> {
            if (jobRepository.count() == 0) {
                Faker faker = new Faker();
                IntStream.rangeClosed(1, 30).forEach(i -> {
                    Job job = new Job();
                    job.setTitle(faker.job().title());
                    job.setDescription(faker.lorem().paragraph(3));
                    job.setCompany(faker.company().name());
                    job.setLocation(faker.address().city());
                    jobRepository.save(job);
                });
                System.out.println("Database populated with 30 dummy jobs.");
            } else {
                System.out.println("Jobs table already contains data, skipping dummy data generation.");
            }
        };
    }
}
