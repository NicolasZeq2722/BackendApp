package com.app.backend.controller;

import com.app.backend.dto.PostulacionResponse;
import com.app.backend.service.PostulacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulacion")
@CrossOrigin(origins = "*")
public class PostulacionController {
    @Autowired
    private PostulacionService postulacionService;

    @PostMapping
    @PreAuthorize("hasRole('ASPIRANTE')")
    public ResponseEntity<?> postularse(@RequestParam Long ofertaId, @RequestParam Long aspiranteId) {
        try {
            PostulacionResponse postulacion = postulacionService.postularse(ofertaId, aspiranteId);
            return ResponseEntity.status(HttpStatus.CREATED).body(postulacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPostulacion(@PathVariable Long id) {
        try {
            PostulacionResponse postulacion = postulacionService.obtenerPostulacion(id);
            return ResponseEntity.ok(postulacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/oferta/{ofertaId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<PostulacionResponse>> listarPostulacionesPorOferta(@PathVariable Long ofertaId) {
        return ResponseEntity.ok(postulacionService.listarPostulacionesPorOferta(ofertaId));
    }

    @GetMapping("/aspirante/{aspiranteId}")
    @PreAuthorize("hasRole('ASPIRANTE')")
    public ResponseEntity<List<PostulacionResponse>> listarPostulacionesPorAspirante(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(postulacionService.listarPostulacionesPorAspirante(aspiranteId));
    }

    @GetMapping("/reclutador/{reclutadorId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<PostulacionResponse>> listarPostulacionesPorReclutador(@PathVariable Long reclutadorId) {
        return ResponseEntity.ok(postulacionService.listarPostulacionesPorReclutador(reclutadorId));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
                                            @RequestParam String estado,
                                            @RequestParam Long reclutadorId) {
        try {
            PostulacionResponse postulacion = postulacionService.cambiarEstado(id, estado, reclutadorId);
            return ResponseEntity.ok(postulacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ASPIRANTE')")
    public ResponseEntity<?> eliminarPostulacion(@PathVariable Long id, @RequestParam Long aspiranteId) {
        try {
            postulacionService.eliminarPostulacion(id, aspiranteId);
            return ResponseEntity.ok("Postulación eliminada");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        }
    }
}
