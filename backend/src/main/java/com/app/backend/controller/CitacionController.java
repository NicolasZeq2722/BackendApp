package com.app.backend.controller;

import com.app.backend.dto.CitacionCreateRequest;
import com.app.backend.dto.CitacionResponse;
import com.app.backend.service.CitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citacion")
@CrossOrigin(origins = "*")
public class CitacionController {
    @Autowired
    private CitacionService citacionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> crearCitacion(@RequestBody CitacionCreateRequest request,
                                            @RequestParam Long reclutadorId) {
        try {
            CitacionResponse citacion = citacionService.crearCitacion(request, reclutadorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(citacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCitacion(@PathVariable Long id, @RequestParam Long usuarioId) {
        try {
            CitacionResponse citacion = citacionService.obtenerCitacion(id, usuarioId);
            return ResponseEntity.ok(citacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/reclutador/{reclutadorId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<CitacionResponse>> listarCitacionesPorReclutador(@PathVariable Long reclutadorId) {
        return ResponseEntity.ok(citacionService.listarCitacionesPorReclutador(reclutadorId));
    }

    @GetMapping("/aspirante/{aspiranteId}")
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<CitacionResponse>> listarCitacionesPorAspirante(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(citacionService.listarCitacionesPorAspirante(aspiranteId));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
                                            @RequestParam String estado,
                                            @RequestParam Long reclutadorId) {
        try {
            CitacionResponse citacion = citacionService.cambiarEstado(id, estado, reclutadorId);
            return ResponseEntity.ok(citacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> eliminarCitacion(@PathVariable Long id, @RequestParam Long reclutadorId) {
        try {
            citacionService.eliminarCitacion(id, reclutadorId);
            return ResponseEntity.ok("Citación eliminada");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }
}
