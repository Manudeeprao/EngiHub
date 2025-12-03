package com.engihub.backend.service;

import com.engihub.backend.dto.APIResponseDTO;
import com.engihub.backend.dto.LoginDTO;
import com.engihub.backend.dto.UserDTO;

public interface AuthService {
    APIResponseDTO signup(UserDTO userDTO);
    APIResponseDTO login(LoginDTO loginDTO);
    APIResponseDTO getUserIdByEmail(String email);
}
