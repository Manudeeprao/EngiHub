package com.engihub.backend.exception;

/**
 * Custom exception for when a requested resource is not found
 * Used throughout the application for consistent 404 handling
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
