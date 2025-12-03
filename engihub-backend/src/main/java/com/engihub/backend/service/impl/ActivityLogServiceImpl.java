package com.engihub.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engihub.backend.model.ActivityLog;
import com.engihub.backend.repository.ActivityLogRepository;
import com.engihub.backend.service.ActivityLogService;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @Override
    public void logActivity(Long projectId, String message) {
        ActivityLog log = new ActivityLog(projectId, message, LocalDateTime.now());
        activityLogRepository.save(log);
    }
    
    @Override
    public List<ActivityLog> getActivityLogs(Long projectId) {
        return activityLogRepository.findByProjectIdOrderByTimestampDesc(projectId);
    }
}
