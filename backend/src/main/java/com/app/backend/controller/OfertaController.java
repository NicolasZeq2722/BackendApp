package com.app.backend.controller;

import com.app.backend.dto.OfertaCreateRequest;
import com.app.backend.dto.OfertaResponse;
import com.app.backend.service.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oferta")
@CrossOrigin(origins = "*")
public class OfertaController {
    @Autowired
    private OfertaService ofertaService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> crearOferta(@RequestBody OfertaCreateRequest request,
                                          @RequestParam Long reclutadorId) {
        try {
            OfertaResponse oferta = ofertaService.crearOferta(request, reclutadorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerOferta(@PathVariable Long id) {
        try {
            OfertaResponse oferta = ofertaService.obtenerOferta(id);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OfertaResponse>> listarOfertasActivas(Authentication authentication) {
        // ✅ Extrae el rol del usuario autenticado y filtra ofertas accordingly
        if (authentication == null) {
            // Si no está autenticado, retorna solo ofertas activas públicamente
            return ResponseEntity.ok(ofertaService.listarOfertasActivas());
        }
        
        // Obtener el rol principal del usuario
        String roleName = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .findFirst()
                .orElse("ROLE_ASPIRANTE")
                .replace("ROLE_", "");
        
        String username = authentication.getName();
        
        // Llamar al servicio con filtro por rol
        return ResponseEntity.ok(ofertaService.listarOfertasPorRol(roleName, username));
    }

    @GetMapping("/reclutador/{reclutadorId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<OfertaResponse>> listarOfertasPorReclutador(@PathVariable Long reclutadorId) {
        return ResponseEntity.ok(ofertaService.listarOfertasPorReclutador(reclutadorId));
    }

    @GetMapping("/buscar/titulo")
    public ResponseEntity<List<OfertaResponse>> buscarPorTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(ofertaService.buscarOfertasPorTitulo(titulo));
    }

    @GetMapping("/buscar/ubicacion")
    public ResponseEntity<List<OfertaResponse>> buscarPorUbicacion(@RequestParam String ubicacion) {
        return ResponseEntity.ok(ofertaService.buscarOfertasPorUbicacion(ubicacion));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> actualizarOferta(@PathVariable Long id,
                                               @RequestBody OfertaCreateRequest request,
                                               @RequestParam Long reclutadorId) {
        try {
            OfertaResponse oferta = ofertaService.actualizarOferta(id, request, reclutadorId);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> eliminarOferta(@PathVariable Long id, @RequestParam Long reclutadorId) {
        try {
            ofertaService.eliminarOferta(id, reclutadorId);
            return ResponseEntity.ok("Oferta eliminada");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }
}
