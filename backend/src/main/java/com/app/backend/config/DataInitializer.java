package com.app.backend.config;

import com.app.backend.model.User;
import com.app.backend.model.Category;
import com.app.backend.repository.UserRepository;
import com.app.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Ejecutando DataInitializer...");

        //Eliminar y recrear usuarios para asegurar contraseñas correctas
        if (userRepository.existsByUsername("admin")) {
            User existingAdmin = userRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null) {
                userRepository.delete(existingAdmin);
                System.out.println("Usuario ADMIN existente eliminado");
            }
        }

        if (userRepository.existsByUsername("reclutador")) {
            User existingReclutador = userRepository.findByUsername("reclutador").orElse(null);
            if (existingReclutador != null) {
                userRepository.delete(existingReclutador);
                System.out.println("Usuario RECLUTADOR existente eliminado");
            }
        }

        // Crear usuario ADMIN
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@app.com");
        admin.setRole(User.Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        System.out.println("Usuario ADMIN creado - username: admin, password: admin123");

        // Crear usuario RECLUTADOR
        User reclutador = new User();
        reclutador.setUsername("reclutador");
        reclutador.setPassword(passwordEncoder.encode("reclu123"));
        reclutador.setEmail("reclutador@app.com");
        reclutador.setRole(User.Role.RECLUTADOR);
        reclutador.setActive(true);
        userRepository.save(reclutador);
        System.out.println("Usuario RECLUTADOR creado - username: reclutador, password: reclu123");

        System.out.println("DataInitializer completado exitosamente.");
    }

    
}