package com.example.jobportal.service;

import com.example.jobportal.model.Job;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class RemoteOkService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Job> fetchRemoteJobs() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set(HttpHeaders.ACCEPT, "application/json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://remoteok.com/api",
                HttpMethod.GET,
                entity,
                String.class
        );

        if (response.getStatusCode().isError()) {
            throw new RuntimeException("Failed to fetch jobs from RemoteOK");
        }

        List<Job> jobs = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response.getBody());

            for (JsonNode node : root) {
                if (node == null || node.isNull()) {
                    continue;
                }

                String title = node.path("position").asText("");
                String company = node.path("company").asText("");
                String location = node.path("location").asText("Remote");
                String description = node.path("description").asText("");
                String url = node.path("url").asText("");

                if (title.isBlank() || company.isBlank()) {
                    continue;
                }

                Job job = new Job();
                job.setTitle(title);
                job.setCompany(company);
                job.setLocation(location);
                job.setDescription(description);
                job.setSource("remoteok");
                job.setUrl(url);

                jobs.add(job);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing RemoteOK response", e);
        }

        return jobs;
    }
}