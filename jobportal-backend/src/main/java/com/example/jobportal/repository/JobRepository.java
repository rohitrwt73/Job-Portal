package com.example.jobportal.repository;

import com.example.jobportal.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

  @Query("SELECT j FROM Job j WHERE " +
      "(:title IS NULL OR :title = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
      "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))")
  List<Job> searchJobsByTitleAndLocation(String title, String location);

}
