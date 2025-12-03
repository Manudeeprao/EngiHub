package com.engihub.backend.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.engihub.backend.model.Project;
import com.engihub.backend.repository.ProjectRepository;

@Component
public class ProjectStatusUpdater {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    
    /**
     * Automatically close projects that have passed their end date
     * Runs every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void autoCloseExpiredProjects() {
        LocalDate today = LocalDate.now();
        List<Project> allProjects = projectRepository.findAll();
        
        for (Project project : allProjects) {
            // Only update projects that are still "Open"
            if (project.getStatus() != null && project.getStatus().equalsIgnoreCase("Open")) {
                try {
                    LocalDate endDate = LocalDate.parse(project.getEndDate(), DATE_FORMATTER);
                    
                    // If end date has passed, close the project
                    if (today.isAfter(endDate)) {
                        project.setStatus("Closed");
                        projectRepository.save(project);
                    }
                } catch (Exception e) {
                    // Log error but continue processing other projects
                    System.err.println("Error parsing end date for project " + project.getId() + ": " + e.getMessage());
                }
            }
        }
    }
    
    /**
     * Manually check and update a specific project's status
     * @param projectId The project ID to check
     * @return true if project was closed, false otherwise
     */
    public boolean checkAndUpdateProjectStatus(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        
        if (project == null || project.getStatus() == null) {
            return false;
        }
        
        if (project.getStatus().equalsIgnoreCase("Closed")) {
            return false; // Already closed
        }
        
        try {
            LocalDate today = LocalDate.now();
            LocalDate endDate = LocalDate.parse(project.getEndDate(), DATE_FORMATTER);
            
            if (today.isAfter(endDate)) {
                project.setStatus("Closed");
                projectRepository.save(project);
                return true;
            }
        } catch (Exception e) {
            System.err.println("Error checking project status: " + e.getMessage());
        }
        
        return false;
    }
    
    /**
     * Check if a project is currently active
     * @param project The project to check
     * @return true if project is active (Open and end date hasn't passed)
     */
    public boolean isProjectActive(Project project) {
        if (project == null || project.getStatus() == null) {
            return false;
        }
        
        if (!project.getStatus().equalsIgnoreCase("Open")) {
            return false;
        }
        
        try {
            LocalDate today = LocalDate.now();
            LocalDate endDate = LocalDate.parse(project.getEndDate(), DATE_FORMATTER);
            return !today.isAfter(endDate);
        } catch (Exception e) {
            System.err.println("Error checking if project is active: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Get remaining days for a project
     * @param project The project to check
     * @return Number of days remaining, or -1 if already closed
     */
    public long getRemainingDays(Project project) {
        if (project == null || project.getEndDate() == null) {
            return -1;
        }
        
        try {
            LocalDate today = LocalDate.now();
            LocalDate endDate = LocalDate.parse(project.getEndDate(), DATE_FORMATTER);
            
            if (today.isAfter(endDate)) {
                return -1; // Already expired
            }
            
            return java.time.temporal.ChronoUnit.DAYS.between(today, endDate);
        } catch (Exception e) {
            System.err.println("Error calculating remaining days: " + e.getMessage());
            return -1;
        }
    }
}
