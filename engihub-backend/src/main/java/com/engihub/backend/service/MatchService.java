package com.engihub.backend.service;

import java.util.List;

import com.engihub.backend.model.Engineer;

public interface MatchService {
    List<Engineer> matchEngineer(Long projectId);
    List<Engineer> matchEngineersByDisciplines(String disciplines);
}

