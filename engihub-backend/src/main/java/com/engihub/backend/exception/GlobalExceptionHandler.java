package com.engihub.backend.exception;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.engihub.backend.dto.APIResponseDTO;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Handle IllegalArgumentException
     * Typically occurs when invalid arguments are passed to methods
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponseDTO> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        System.err.println("IllegalArgumentException: " + ex.getMessage());
        
        APIResponseDTO response = new APIResponseDTO(
            false,
            "Invalid input provided. Please check your request and try again."
        );
        response.setTimestamp(LocalDateTime.now().format(formatter));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle NullPointerException
     * Typically occurs when trying to access null objects
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<APIResponseDTO> handleNullPointerException(
            NullPointerException ex, WebRequest request) {
        System.err.println("NullPointerException: " + ex.getMessage());
        
        APIResponseDTO response = new APIResponseDTO(
            false,
            "An unexpected error occurred. Please try again or contact support."
        );
        response.setTimestamp(LocalDateTime.now().format(formatter));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle validation errors from @Valid annotation
     * Occurs when request body validation fails
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponseDTO> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        System.err.println("Validation Error: " + ex.getMessage());
        
        StringBuilder errorMessage = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            if (errorMessage.length() > 0) {
                errorMessage.append("; ");
            }
            errorMessage.append(error.getField())
                       .append(" is ")
                       .append(error.getDefaultMessage());
        });
        
        APIResponseDTO response = new APIResponseDTO(
            false,
            errorMessage.toString().isEmpty() ? 
                "Please provide valid input data." : 
                errorMessage.toString()
        );
        response.setTimestamp(LocalDateTime.now().format(formatter));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle ResourceNotFoundException
     * Custom exception for when a requested resource is not found
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponseDTO> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        System.err.println("ResourceNotFoundException: " + ex.getMessage());
        
        APIResponseDTO response = new APIResponseDTO(false, ex.getMessage());
        response.setTimestamp(LocalDateTime.now().format(formatter));
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Fallback handler for all other exceptions
     * Catches generic Exception and any unhandled exception types
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponseDTO> handleGenericException(
            Exception ex, WebRequest request) {
        System.err.println("Exception: " + ex.getMessage());
        ex.printStackTrace();
        
        APIResponseDTO response = new APIResponseDTO(
            false,
            "An unexpected error occurred. Our team has been notified. Please try again later."
        );
        response.setTimestamp(LocalDateTime.now().format(formatter));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
