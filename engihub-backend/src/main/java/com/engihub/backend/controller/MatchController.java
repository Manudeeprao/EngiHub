package com.engihub.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.dto.EngineerDTO;
import com.engihub.backend.model.Engineer;
import com.engihub.backend.service.MatchService;

@RestController
@RequestMapping("/api/match")
public class MatchController {
    @Autowired
    private MatchService matchService;

    @GetMapping("/{projectId}")
    public ResponseEntity<APIResponseDTO> matchEngineer(@PathVariable Long projectId) {
        List<Engineer> matchedEngineers = matchService.matchEngineer(projectId);
        
        // Convert Engineer objects to EngineerDTO
        List<EngineerDTO> engineerDTOs = matchedEngineers.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        APIResponseDTO response = new APIResponseDTO(true, "Matched engineers found.");
        response.setData(engineerDTOs);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/byDisciplines")
    public ResponseEntity<APIResponseDTO> matchEngineersByDisciplines(@RequestParam String disciplines) {
        List<Engineer> matchedEngineers = matchService.matchEngineersByDisciplines(disciplines);
        
        // Convert Engineer objects to EngineerDTO
        List<EngineerDTO> engineerDTOs = matchedEngineers.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        APIResponseDTO response = new APIResponseDTO(true, "Matched engineers found.");
        response.setData(engineerDTOs);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Convert Engineer entity to EngineerDTO
     */
    private EngineerDTO convertToDTO(Engineer engineer) {
        return new EngineerDTO(
            engineer.getId(),
            engineer.getUserId(),
            engineer.getName(),
            engineer.getSpecialization(),
            extractYearsFromExperience(engineer.getExperience()),
            engineer.getBio()
        );
    }
    
    /**
     * Extract years as integer from experience string
     */
    private int extractYearsFromExperience(String experienceStr) {
        if (experienceStr == null || experienceStr.isEmpty()) {
            return 0;
        }
        
        try {
            String numberStr = experienceStr.replaceAll("[^0-9]", "");
            if (!numberStr.isEmpty()) {
                return Integer.parseInt(numberStr);
            }
        } catch (NumberFormatException e) {
            // If conversion fails, return 0
        }
        
        return 0;
    }
}