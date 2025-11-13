package com.app.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.backend.dto.UserCreateRequest;
import com.app.backend.dto.UserUpdateRequest;
import com.app.backend.models.User;
import com.app.backend.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new 
        RuntimeException("Usuario no encontrado"));
    }

    public User create(UserCreateRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setActive(request.getIsActive() != null ? request.getIsActive() : true);

        return userRepository.save(user);
    }

    public User update (Long id, UserUpdateRequest request) {
        User user = findById(id);
        
        //validar que el cordinador no pueda modificar el admin principal
        if(id == 1L && isCoordinator()) {
            throw new RuntimeException("No tienes permiso para modificar este usuario");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setActive(request.getIsActive());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    private boolean isCoordinator() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getAuthorities() != null) {
            return authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_COORDINATOR"));
        }
        return false;
    }

    public void delete(Long id) {
        User user = findById(id);

        //validar que no se elimine el usuario admin principal
        if (id == 1L) {
            throw new RuntimeException("No se puede eliminar el administrador principal");
        }
        // validar que el usuario exista
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        userRepository.delete(user);
    }
}