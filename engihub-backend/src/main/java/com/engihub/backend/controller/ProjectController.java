package com.engihub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.dto.UpdateProjectStatusDTO;
import com.engihub.backend.model.ActivityLog;
import com.engihub.backend.model.Assignment;
import com.engihub.backend.model.Project;
import com.engihub.backend.repository.AssignmentRepository;
import com.engihub.backend.repository.EngineerRepository;
import com.engihub.backend.repository.ProjectRepository;
import com.engihub.backend.service.ActivityLogService;
import com.engihub.backend.service.ProjectService;
import com.engihub.backend.util.ProjectStatusUpdater;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ProjectStatusUpdater projectStatusUpdater;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private EngineerRepository engineerRepository;
    
    @Autowired
    private ActivityLogService activityLogService;

    @PostMapping("/create")
    public ResponseEntity<APIResponseDTO> createProject(@RequestBody Project project) {
        try {
            Project createdProject = projectService.createProject(project);
            APIResponseDTO response = new APIResponseDTO(true, "Project created successfully");
            response.setData(createdProject);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            APIResponseDTO response = new APIResponseDTO(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/createWithAssignments")
    public ResponseEntity<APIResponseDTO> createProjectWithAssignments(@RequestBody CreateProjectWithAssignmentsRequest request) {
        try {
            Long clientId = request.getClientId();
            String title = request.getTitle();
            String description = request.getDescription();
            String disciplines = request.getDisciplines();
            Double budget = request.getBudget();
            String startDate = request.getStartDate();
            String endDate = request.getEndDate();
            List<Long> engineerIds = request.getEngineerIds();
            
            // Validate required fields
            if (title == null || title.trim().isEmpty()) {
                APIResponseDTO response = new APIResponseDTO(false, "Project title is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (engineerIds == null || engineerIds.isEmpty()) {
                APIResponseDTO response = new APIResponseDTO(false, "At least one engineer must be selected");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create project
            Project project = new Project();
            project.setClientId(clientId);
            project.setTitle(title);
            project.setDescription(description);
            project.setDisciplines(disciplines);
            project.setBudget(budget);
            project.setStartDate(startDate);
            project.setEndDate(endDate);
            project.setStatus("Open");
            
            Project createdProject = projectService.createProject(project);
            
            // Create assignments for each engineer
            for (Long engineerId : engineerIds) {
                // Verify engineer exists
                if (engineerRepository.existsById(engineerId)) {
                    Assignment assignment = new Assignment();
                    assignment.setProjectId(createdProject.getId());
                    assignment.setEngineerId(engineerId);
                    assignmentRepository.save(assignment);
                }
            }
            
            APIResponseDTO response = new APIResponseDTO(true, "Project created and engineers assigned successfully");
            response.setData(createdProject);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            APIResponseDTO response = new APIResponseDTO(false, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            APIResponseDTO response = new APIResponseDTO(false, "Error creating project and assignments: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<List<Project>> getProjectsByClient(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectsByClient(id));
    }
    
    @GetMapping("/check-status/{id}")
    public ResponseEntity<APIResponseDTO> checkProjectStatus(@PathVariable Long id) {
        boolean wasClosed = projectStatusUpdater.checkAndUpdateProjectStatus(id);
        APIResponseDTO response = new APIResponseDTO(true, "Project status checked");
        response.setData(wasClosed ? "Project has been automatically closed" : "Project is still active");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/remaining-days")
    public ResponseEntity<APIResponseDTO> getRemainingDays(@PathVariable Long id) {
        Project project = projectService.getProjectsByClient(id).stream()
            .filter(p -> p.getId().equals(id))
            .findFirst()
            .orElse(null);
        
        if (project == null) {
            APIResponseDTO response = new APIResponseDTO(false, "Project not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        long remainingDays = projectStatusUpdater.getRemainingDays(project);
        APIResponseDTO response = new APIResponseDTO(true, "Remaining days calculated");
        response.setData(remainingDays);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<APIResponseDTO> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody UpdateProjectStatusDTO statusRequest) {
        try {
            Project project = projectRepository.findById(id).orElse(null);
            
            if (project == null) {
                APIResponseDTO response = new APIResponseDTO(false, "Project not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate status
            String newStatus = statusRequest.getStatus();
            if (!newStatus.matches("Open|Ongoing|Completed")) {
                APIResponseDTO response = new APIResponseDTO(false, "Invalid status. Allowed values: Open, Ongoing, Completed");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Update status
            project.setStatus(newStatus);
            projectRepository.save(project);
            
            // Log activity
            activityLogService.logActivity(id, "Project status changed to " + newStatus);
            
            APIResponseDTO response = new APIResponseDTO(true, "Project status updated to: " + newStatus);
            response.setData(project);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            APIResponseDTO response = new APIResponseDTO(false, "Error updating project status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/{id}/activity")
    public ResponseEntity<APIResponseDTO> getProjectActivity(@PathVariable Long id) {
        try {
            Project project = projectRepository.findById(id).orElse(null);
            
            if (project == null) {
                APIResponseDTO response = new APIResponseDTO(false, "Project not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<ActivityLog> activityLogs = activityLogService.getActivityLogs(id);
            APIResponseDTO response = new APIResponseDTO(true, "Activity logs retrieved");
            response.setData(activityLogs);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            APIResponseDTO response = new APIResponseDTO(false, "Error retrieving activity logs: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // DTO for creating project with assignments
    public static class CreateProjectWithAssignmentsRequest {
        private Long clientId;
        private String title;
        private String description;
        private String disciplines;
        private Double budget;
        private String startDate;
        private String endDate;
        private List<Long> engineerIds;
        
        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getDisciplines() { return disciplines; }
        public void setDisciplines(String disciplines) { this.disciplines = disciplines; }
        
        public Double getBudget() { return budget; }
        public void setBudget(Double budget) { this.budget = budget; }
        
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
        
        public List<Long> getEngineerIds() { return engineerIds; }
        public void setEngineerIds(List<Long> engineerIds) { this.engineerIds = engineerIds; }
    }
}

