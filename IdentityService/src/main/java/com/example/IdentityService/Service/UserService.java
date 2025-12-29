package com.example.IdentityService.Service;

import com.example.IdentityService.Domain.ResDTO.UserDTO;
import com.example.IdentityService.Domain.User;
import com.example.IdentityService.Repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public UserDTO getUserByEmail(String username) {
        User user = userRepository.findByUsername(username);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setAdmin(user.isAdmin());
        userDTO.setName(user.getUsername());
        return userDTO;
    }
    @Transactional
    public UserDTO CreateUser(User user) {
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        this.userRepository.save(user);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setAdmin(user.isAdmin());
        userDTO.setName(user.getUsername());
        return userDTO;
    }
}
