package com.example.jobportal.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class JobSyncService {

    private final RemoteOkService remoteOkService;

    public JobSyncService(RemoteOkService remoteOkService) {
        this.remoteOkService = remoteOkService;
    }

    @Scheduled(fixedRate = 600000) // 10 minutes
    public void syncRemoteJobs() {
        // Optional: persist or refresh remote jobs later
        remoteOkService.fetchRemoteJobs();
    }
}