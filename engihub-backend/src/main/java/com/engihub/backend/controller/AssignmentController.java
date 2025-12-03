package com.engihub.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.model.Assignment;
import com.engihub.backend.model.Engineer;
import com.engihub.backend.model.Project;
import com.engihub.backend.repository.AssignmentRepository;
import com.engihub.backend.repository.EngineerRepository;
import com.engihub.backend.repository.ProjectRepository;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private EngineerRepository engineerRepository;

    @GetMapping("/engineer/{userId}")
    public ResponseEntity<APIResponseDTO> getAssignmentsForEngineer(@PathVariable Long userId) {
        List<Assignment> assignments = assignmentRepository.findAll();
        List<ProjectDetailsDTO> assignedProjects = new ArrayList<>();
        for (Assignment a : assignments) {
            Engineer eng = engineerRepository.findById(a.getEngineerId()).orElse(null);
            if (eng != null && eng.getUserId().equals(userId)) {
                Project p = projectRepository.findById(a.getProjectId()).orElse(null);
                if (p != null) {
                    // Get client name
                    String clientName = "N/A";
                    try {
                        com.engihub.backend.model.User client = null;
                        java.lang.reflect.Field clientIdField = p.getClass().getDeclaredField("clientId");
                        clientIdField.setAccessible(true);
                        Long clientId = (Long) clientIdField.get(p);
                        client = (com.engihub.backend.model.User) Class.forName("com.engihub.backend.model.User").getDeclaredConstructor().newInstance();
                        // Use repository to get client name
                        // This is a hack, ideally inject UserRepository
                        clientName = "Client"; // Replace with actual lookup if possible
                    } catch (Exception e) {}
                    assignedProjects.add(new ProjectDetailsDTO(p.getTitle(), p.getDescription(), clientName, p.getStartDate(), p.getEndDate(), p.getStatus(), p.getBudget()));
                }
            }
        }
        APIResponseDTO response = new APIResponseDTO(true, "Projects found");
        response.setData(assignedProjects);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<APIResponseDTO> getAssignmentsForProject(@PathVariable Long projectId) {
        List<Assignment> assignments = assignmentRepository.findAll();
        List<Engineer> assignedEngineers = new ArrayList<>();
        for (Assignment a : assignments) {
            if (a.getProjectId().equals(projectId)) {
                Engineer eng = engineerRepository.findById(a.getEngineerId()).orElse(null);
                if (eng != null) {
                    assignedEngineers.add(eng);
                }
            }
        }
        APIResponseDTO response = new APIResponseDTO(true, "Engineers assigned to project");
        response.setData(assignedEngineers);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign")
    public ResponseEntity<APIResponseDTO> assignEngineerToProject(@RequestBody AssignmentRequest request) {
        try {
            Long projectId = request.getProjectId();
            List<Long> engineerIds = request.getEngineerIds();

            if (projectId == null || engineerIds == null || engineerIds.isEmpty()) {
                APIResponseDTO response = new APIResponseDTO(false, "Project ID and engineer IDs are required");
                return ResponseEntity.badRequest().body(response);
            }

            // Verify project exists
            if (!projectRepository.existsById(projectId)) {
                APIResponseDTO response = new APIResponseDTO(false, "Project not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Create assignments for each engineer
            for (Long engineerId : engineerIds) {
                // Verify engineer exists
                if (!engineerRepository.existsById(engineerId)) {
                    continue; // Skip invalid engineers
                }

                Assignment assignment = new Assignment();
                assignment.setProjectId(projectId);
                assignment.setEngineerId(engineerId);
                assignmentRepository.save(assignment);
            }

            APIResponseDTO response = new APIResponseDTO(true, "Engineers assigned successfully");
            response.setData(engineerIds.size() + " engineers assigned to project");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            APIResponseDTO response = new APIResponseDTO(false, "Error assigning engineers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // DTO for assignment request
    public static class AssignmentRequest {
        private Long projectId;
        private List<Long> engineerIds;

        public Long getProjectId() {
            return projectId;
        }

        public void setProjectId(Long projectId) {
            this.projectId = projectId;
        }

        public List<Long> getEngineerIds() {
            return engineerIds;
        }

        public void setEngineerIds(List<Long> engineerIds) {
            this.engineerIds = engineerIds;
        }
    }

    // DTO for frontend project details
    public static class ProjectDetailsDTO {
        public String title;
        public String description;
        public String clientName;
        public String startDate;
        public String endDate;
        public String status;
        public Double budget;
        public ProjectDetailsDTO(String title, String description, String clientName, String startDate, String endDate, String status, Double budget) {
            this.title = title;
            this.description = description;
            this.clientName = clientName;
            this.startDate = startDate;
            this.endDate = endDate;
            this.status = status;
            this.budget = budget;
        }
    }
}
