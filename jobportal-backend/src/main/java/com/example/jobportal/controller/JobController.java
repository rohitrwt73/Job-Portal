package com.example.jobportal.controller;
import com.example.jobportal.service.JobService;

import com.example.jobportal.model.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // ✅ Create a new Job
    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    // ✅ Get all Jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // ✅ Get Job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update Job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        Job job = jobService.updateJob(id, updatedJob);
        return job != null ? ResponseEntity.ok(job) : ResponseEntity.notFound().build();
    }

    // ✅ Delete Job
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    // Search Jobs (Optional, if you want to keep search functionality)
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String title, @RequestParam String location) {
        return jobService.searchJobs(title, location);
    }

}
