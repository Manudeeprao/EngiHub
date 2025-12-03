package com.engihub.backend.service;

import java.util.List;

import com.engihub.backend.model.Project;

public interface ProjectService {
    Project createProject(Project project); // Accepts 'disciplines' field
    List<Project> getProjectsByClient(Long clientId);
}
