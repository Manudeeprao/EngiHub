package com.engihub.backend.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engihub.backend.model.Project;
import com.engihub.backend.repository.ProjectRepository;
import com.engihub.backend.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project createProject(Project project) {
        // Validate project data before saving
        validateProjectData(project);
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getProjectsByClient(Long clientId) {
        return projectRepository.findByClientId(clientId);
    }

    /**
     * Validates all project creation requirements
     * Throws IllegalArgumentException if any validation fails
     */
    private void validateProjectData(Project project) {
        // Validate title
        if (project.getTitle() == null || project.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Project title is required and cannot be empty.");
        }

        // Validate description
        if (project.getDescription() == null || project.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Project description is required and cannot be empty.");
        }

        // Validate budget
        if (project.getBudget() == null || project.getBudget() <= 0) {
            throw new IllegalArgumentException("Project budget must be greater than 0.");
        }

        // Validate startDate
        if (project.getStartDate() == null || project.getStartDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Project start date is required.");
        }

        // Validate endDate
        if (project.getEndDate() == null || project.getEndDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Project end date is required.");
        }

        // Validate disciplines
        if (project.getDisciplines() == null || project.getDisciplines().trim().isEmpty()) {
            throw new IllegalArgumentException("Project must have at least one discipline selected.");
        }

        // Validate date format and endDate > startDate
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
            LocalDate startDate = LocalDate.parse(project.getStartDate(), formatter);
            LocalDate endDate = LocalDate.parse(project.getEndDate(), formatter);

            if (!endDate.isAfter(startDate)) {
                throw new IllegalArgumentException("Project end date must be after the start date.");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Project dates must be in valid ISO format (YYYY-MM-DD).");
        }
    }
}
