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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.model.Engineer;
import com.engihub.backend.service.EngineerService;

@RestController
@RequestMapping("/api/engineers")
@CrossOrigin(origins = "*")
public class EngineerController {
    @Autowired
    private EngineerService engineerService;

    @PostMapping("/register")
    public ResponseEntity<Engineer> registerEngineer(@RequestBody Engineer engineer) {
        return ResponseEntity.ok(engineerService.registerEngineer(engineer));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Engineer>> getAllEngineers() {
        return ResponseEntity.ok(engineerService.getAllEngineers());
    }

    @GetMapping("/category/{spec}")
    public ResponseEntity<List<Engineer>> getBySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(engineerService.getBySpecialization(spec));
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<APIResponseDTO> updateEngineerProfile(
            @PathVariable Long userId,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String experience) {
        try {
            engineerService.updateEngineerProfile(userId, bio, experience);
            return ResponseEntity.ok(new APIResponseDTO(true, "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.ok(new APIResponseDTO(false, "Failed to update profile: " + e.getMessage()));
        }
    }
}
