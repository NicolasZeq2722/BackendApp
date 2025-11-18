package com.app.backend.service;

import com.app.backend.dto.UserCreateRequest;
import com.app.backend.dto.UserUpdateRequest;
import com.app.backend.model.User;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User create(UserCreateRequest request) {

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(request.getActive() != null ? request.getActive() : true);

        // Ahora el rol se toma directamente del enum enviado en el DTO
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        } else {
            user.setRole(User.Role.COORDINADOR); // Rol por defecto
        }

        return userRepository.save(user);
    }

    public User update(Long id, UserUpdateRequest request) {

        User user = findById(id);

        if (id == 1L && isCoordinador()) {
            throw new RuntimeException("No tienes permiso de modificar el administrador principal");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setActive(request.getActive());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole()); // Igual, directo del enum
        }

        return userRepository.save(user);
    }

    private Boolean isCoordinador() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities() != null) {
            return auth.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_COORDINADOR"));
        }
        return false;
    }

    public void delete(Long id) {

        User user = findById(id);

        if (id == 1L) {
            throw new RuntimeException("No se puede eliminar el administrador principal");
        }

        userRepository.delete(user);
    }
}
