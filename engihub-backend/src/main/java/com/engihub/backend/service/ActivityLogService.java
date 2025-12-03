package com.engihub.backend.service;

import java.util.List;

import com.engihub.backend.model.ActivityLog;

public interface ActivityLogService {
    void logActivity(Long projectId, String message);
    List<ActivityLog> getActivityLogs(Long projectId);
}
