package com.expensesharing.controller;

import com.expensesharing.dto.ApiResponseDTO;
import com.expensesharing.dto.LoginRequestDTO;
import com.expensesharing.dto.RegisterRequestDTO;
import com.expensesharing.dto.UserDTO;
import com.expensesharing.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<UserDTO>> register(@Valid @RequestBody RegisterRequestDTO request) {
        UserDTO user = authService.register(request);
        return ResponseEntity.ok(ApiResponseDTO.success("User registered", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<UserDTO>> login(@Valid @RequestBody LoginRequestDTO request,
                                                         HttpSession session) {
        UserDTO user = authService.login(request, session);
        return ResponseEntity.ok(ApiResponseDTO.success("Login successful", user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDTO<UserDTO>> getCurrentUser(HttpSession session) {
        UserDTO user = authService.getCurrentUser(session);
        return ResponseEntity.ok(ApiResponseDTO.success("User retrieved", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Void>> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok(ApiResponseDTO.success("Logout successful"));
    }
}
