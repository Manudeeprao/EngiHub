package com.engihub.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.dto.LoginDTO;
import com.engihub.backend.dto.UserDTO;
import com.engihub.backend.model.User;
import com.engihub.backend.repository.UserRepository;
import com.engihub.backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.engihub.backend.repository.EngineerRepository engineerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public APIResponseDTO signup(UserDTO userDTO) {
        System.out.println("Signup request received: " + userDTO.getEmail());
        User user = userRepository.findByEmail(userDTO.getEmail());
        if (user != null) {
            System.out.println("Signup failed: Email already exists");
            return new APIResponseDTO(false, "Email already exists");
        }
        user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        // Hash password using BCrypt
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        userRepository.save(user);
        // If engineer, create Engineer record
        if ("Engineer".equalsIgnoreCase(userDTO.getRole())) {
            com.engihub.backend.model.Engineer engineer = new com.engihub.backend.model.Engineer();
            engineer.setUserId(user.getId());
            engineer.setName(userDTO.getName());
            engineer.setSpecialization(userDTO.getSpecialization());
            engineer.setExperience(userDTO.getExperience());
            engineer.setBio(userDTO.getBio());
            engineerRepository.save(engineer);
        }
        System.out.println("Signup successful for: " + userDTO.getEmail());
        return new APIResponseDTO(true, "Signup successful");
    }
    @Override
    public APIResponseDTO login(LoginDTO loginDTO) {
        System.out.println("Login request received: " + loginDTO.getEmail());
        User user = userRepository.findByEmail(loginDTO.getEmail());
        if (user != null && passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            System.out.println("Login successful for: " + loginDTO.getEmail());
            APIResponseDTO response = new APIResponseDTO(true, "Login successful");
            response.setRole(user.getRole());
            response.setId(user.getId());
            return response;
        }
        System.out.println("Login failed for: " + loginDTO.getEmail());
        return new APIResponseDTO(false, "Invalid credentials");
    }

    @Override
    public APIResponseDTO getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new APIResponseDTO(false, "User not found");
        }
        APIResponseDTO response = new APIResponseDTO(true, "User found");
        response.setId(user.getId());
        return response;
    }
}
