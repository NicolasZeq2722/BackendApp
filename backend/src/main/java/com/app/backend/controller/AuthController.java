package com.app.backend.controller;

import com.app.backend.dto.LoginRequest;
import com.app.backend.dto.LoginResponse;
import com.app.backend.model.User;
import com.app.backend.repository.UserRepository;
import com.app.backend.security.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        try {
            // 1. Autenticación
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // 2. Guardar autenticación en el contexto de Spring Security
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Generar token
            String jwt = tokenProvider.generateToken(authentication);

            // 4. Buscar usuario en BD
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // 5. Respuesta correcta
            return ResponseEntity.ok(new LoginResponse(jwt, user));

        } catch (BadCredentialsException e) {
            // Error real de credenciales inválidas
            return ResponseEntity.badRequest().body("{\"error\": \"Credenciales invalidas\"}");
        } catch (Exception e) {
            // Errores internos (serialización, tokenProvider, etc.)
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Error interno en el servidor\"}");
        }
    }
}
