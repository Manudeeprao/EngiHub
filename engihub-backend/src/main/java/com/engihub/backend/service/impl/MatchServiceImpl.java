package com.engihub.backend.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engihub.backend.model.Engineer;
import com.engihub.backend.model.Project;
import com.engihub.backend.repository.EngineerRepository;
import com.engihub.backend.repository.ProjectRepository;
import com.engihub.backend.service.MatchService;

@Service
public class MatchServiceImpl implements MatchService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private EngineerRepository engineerRepository;

    @Override
    public List<Engineer> matchEngineer(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return new ArrayList<>();
        
        String disciplines = project.getDisciplines();
        if (disciplines == null || disciplines.isEmpty()) return new ArrayList<>();
        
        return matchEngineersByDisciplines(disciplines);
    }
    
    @Override
    public List<Engineer> matchEngineersByDisciplines(String disciplines) {
        if (disciplines == null || disciplines.isEmpty()) return new ArrayList<>();
        
        String[] disciplineArray = disciplines.split(",");
        Map<Long, Integer> engineerScores = new HashMap<>();
        Map<String, List<Engineer>> engineersBySpecialization = new HashMap<>();
        
        // For each selected discipline, find matching engineers and score them
        for (String discipline : disciplineArray) {
            String trimmedDiscipline = discipline.trim();
            List<Engineer> engineersForDiscipline = engineerRepository.findBySpecialization(trimmedDiscipline);
            
            for (Engineer engineer : engineersForDiscipline) {
                int score = calculateScore(engineer, trimmedDiscipline);
                engineerScores.put(engineer.getId(), score);
                
                // Group by specialization
                engineersBySpecialization.computeIfAbsent(trimmedDiscipline, k -> new ArrayList<>())
                    .add(engineer);
            }
        }
        
        // Sort engineers within each specialization group by score (descending)
        for (List<Engineer> engineers : engineersBySpecialization.values()) {
            engineers.sort((e1, e2) -> {
                int score1 = engineerScores.getOrDefault(e1.getId(), 0);
                int score2 = engineerScores.getOrDefault(e2.getId(), 0);
                return Integer.compare(score2, score1); // Descending order
            });
        }
        
        // Round-robin distribution from each specialization group
        List<Engineer> result = new ArrayList<>();
        boolean hasMore = true;
        int index = 0;
        
        while (hasMore) {
            hasMore = false;
            for (List<Engineer> engineers : engineersBySpecialization.values()) {
                if (index < engineers.size()) {
                    result.add(engineers.get(index));
                    hasMore = true;
                }
            }
            index++;
        }
        
        // Return up to 5 engineers distributed across specializations
        return result.stream()
                .limit(5)
                .collect(Collectors.toList());
    }
    
    /**
     * Calculate weighted score for an engineer based on:
     * - Exact specialization match: +50 points
     * - Experience > 10 years: +10 points
     * - Experience > 5 years: +5 points
     */
    private int calculateScore(Engineer engineer, String selectedDiscipline) {
        int score = 0;
        
        // Exact specialization match
        if (engineer.getSpecialization() != null && 
            engineer.getSpecialization().equalsIgnoreCase(selectedDiscipline)) {
            score += 50;
        }
        
        // Experience-based scoring
        int yearsOfExperience = extractYearsFromExperience(engineer.getExperience());
        if (yearsOfExperience > 10) {
            score += 10;
        } else if (yearsOfExperience > 5) {
            score += 5;
        }
        
        return score;
    }
    
    /**
     * Extract years as integer from experience string
     * Example: "7" or "7 years" -> 7
     */
    private int extractYearsFromExperience(String experienceStr) {
        if (experienceStr == null || experienceStr.isEmpty()) {
            return 0;
        }
        
        try {
            // Try to extract the first number from the string
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
