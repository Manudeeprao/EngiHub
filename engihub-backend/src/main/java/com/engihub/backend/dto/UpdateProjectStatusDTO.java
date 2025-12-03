package com.engihub.backend.dto;

public class UpdateProjectStatusDTO {
    private String status;

    public UpdateProjectStatusDTO() {}

    public UpdateProjectStatusDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
