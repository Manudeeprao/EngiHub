package com.engihub.backend.service;

import java.util.List;

import com.engihub.backend.model.Engineer;

public interface EngineerService {
    Engineer registerEngineer(Engineer engineer);
    List<Engineer> getAllEngineers();
    List<Engineer> getBySpecialization(String specialization);
    void updateEngineerProfile(Long userId, String bio, String experience);
}
