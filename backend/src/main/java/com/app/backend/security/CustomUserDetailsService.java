package com.app.backend.security;

import com.app.backend.model.User;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // ---------------------------------------------------------
        // LOGS PARA DEPURAR EL PROBLEMA DEL LOGIN
        // ---------------------------------------------------------
        System.out.println("➡️  Cargando usuario desde CustomUserDetailsService: " + username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("❌ Usuario NO encontrado en BD: " + username);
                    return new UsernameNotFoundException("Usuario no encontrado");
                });

        System.out.println("✅ Usuario encontrado: " + user.getUsername());
        System.out.println("🔐 Password almacenada (BCrypt): " + user.getPassword());
        System.out.println("📌 Estado activo: " + user.getActive());
        System.out.println("📌 Rol: " + user.getRole());

        // ---------------------------------------------------------
        // ESTABLECER EL ROLE USANDO EL ENUM REAL
        // ---------------------------------------------------------
        GrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())        // Encriptada en BCrypt
                .authorities(authority)              // Rol real del usuario
                .accountLocked(!user.getActive())    // si active = false → bloqueo
                .disabled(!user.getActive())
                .build();
    }
}
