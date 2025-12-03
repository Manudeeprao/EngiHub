package com.engihub.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engihub.backend.model.Engineer;
import com.engihub.backend.repository.EngineerRepository;
import com.engihub.backend.service.EngineerService;

@Service
public class EngineerServiceImpl implements EngineerService {
    @Autowired
    private EngineerRepository engineerRepository;

    @Override
    public Engineer registerEngineer(Engineer engineer) {
        return engineerRepository.save(engineer);
    }

    @Override
    public List<Engineer> getAllEngineers() {
        return engineerRepository.findAll();
    }

    @Override
    public List<Engineer> getBySpecialization(String specialization) {
        return engineerRepository.findBySpecialization(specialization);
    }

    @Override
    public void updateEngineerProfile(Long userId, String bio, String experience) {
        Engineer engineer = engineerRepository.findByUserId(userId);
        if (engineer != null) {
            if (bio != null && !bio.isEmpty()) {
                engineer.setBio(bio);
            }
            if (experience != null && !experience.isEmpty()) {
                engineer.setExperience(experience);
            }
            engineerRepository.save(engineer);
        }
    }
}
