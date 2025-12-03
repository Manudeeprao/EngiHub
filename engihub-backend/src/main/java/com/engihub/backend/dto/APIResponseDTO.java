package com.engihub.backend.dto;


public class APIResponseDTO {
    private boolean success;
    private String message;
    private String role;
    private Long id;
    private Object data; // Added data field
    private String timestamp; // Added timestamp field

    public APIResponseDTO() {}

    public APIResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public APIResponseDTO(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Object getData() { return data; } // Added getter for data
    public void setData(Object data) { this.data = data; } // Added setter for data
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
