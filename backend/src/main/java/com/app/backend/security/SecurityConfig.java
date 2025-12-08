package com.app.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("GET", "/api/oferta").permitAll()
                .requestMatchers("GET", "/api/oferta/**").permitAll()
                .requestMatchers("GET", "/api/oferta/buscar/**").permitAll()
                
                // ✅ NUEVO: Permitir que Reclutadores y Admin vean usuarios por rol
                .requestMatchers("GET", "/api/users/role/**").hasAnyRole("RECLUTADOR", "ADMIN")
                
                // Rutas protegidas - Ofertas
                .requestMatchers("POST", "/api/oferta").hasAnyRole("RECLUTADOR", "ADMIN")
                .requestMatchers("PUT", "/api/oferta/**").hasAnyRole("RECLUTADOR", "ADMIN")
                .requestMatchers("DELETE", "/api/oferta/**").hasAnyRole("RECLUTADOR", "ADMIN")
                
                // Rutas protegidas - Postulaciones
                .requestMatchers("POST", "/api/postulacion").hasRole("ASPIRANTE")
                .requestMatchers("GET", "/api/postulacion/**").hasAnyRole("ASPIRANTE", "RECLUTADOR", "ADMIN")
                .requestMatchers("PUT", "/api/postulacion/**").hasAnyRole("RECLUTADOR", "ADMIN")
                .requestMatchers("DELETE", "/api/postulacion/**").hasRole("ASPIRANTE")
                
                // Rutas protegidas - Citaciones
                .requestMatchers("/api/citacion/**").hasAnyRole("ASPIRANTE", "RECLUTADOR", "ADMIN")
                
                // Rutas protegidas - Notificaciones
                .requestMatchers("/api/notificacion/**").hasAnyRole("ASPIRANTE", "RECLUTADOR", "ADMIN")
                
                // Rutas protegidas - Usuarios (CRUD Admin)
                .requestMatchers("GET", "/api/users").hasAnyRole("ADMIN")
                .requestMatchers("POST", "/api/users").hasAnyRole("ADMIN")
                .requestMatchers("PUT", "/api/users/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers("DELETE", "/api/users/**").hasAnyRole("ADMIN")
                
                // H2 Console (para desarrollo)
                .requestMatchers("/h2-console/**").permitAll()
                
                .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // Para H2 console
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}