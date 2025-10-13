package com.expensesharing.service;

import com.expensesharing.dto.LoginRequestDTO;
import com.expensesharing.dto.RegisterRequestDTO;
import com.expensesharing.dto.UserDTO;
import com.expensesharing.entity.User;
import com.expensesharing.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO register(RegisterRequestDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt().toString()
        );
    }

    public UserDTO login(LoginRequestDTO request, HttpSession session) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        User user = userOpt.get();
        session.setAttribute("userId", user.getId());

        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt().toString());
    }

    public UserDTO getCurrentUser(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("Not logged in");
        }

        Optional<User> userOpt = userRepository.findById((Long) userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOpt.get();
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt().toString());
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }
}
