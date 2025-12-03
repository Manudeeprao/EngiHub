package com.engihub.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.dto.LoginDTO;
import com.engihub.backend.dto.UserDTO;
import com.engihub.backend.service.AuthService;

@CrossOrigin(origins = "*") // <-- Add this annotation
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<APIResponseDTO> signup(@RequestBody UserDTO userDTO) {
        APIResponseDTO response = authService.signup(userDTO);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        APIResponseDTO response = authService.login(loginDTO);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/getUserId")
    public ResponseEntity<APIResponseDTO> getUserId(@RequestParam String email) {
        APIResponseDTO response = authService.getUserIdByEmail(email);
        return ResponseEntity.ok(response);
    }
}
