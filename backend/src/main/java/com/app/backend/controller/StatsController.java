package com.app.backend.controller;

import com.app.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private StatsService statsService;

    /**
     * Obtiene estadísticas generales del sistema (solo ADMIN)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = statsService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Obtiene estadísticas de un reclutador específico
     */
    @GetMapping("/reclutador/{reclutadorId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> getStatsByReclutador(@PathVariable Long reclutadorId) {
        try {
            Map<String, Object> stats = statsService.getStatsByReclutador(reclutadorId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Obtiene estadísticas de un aspirante específico
     */
    @GetMapping("/aspirante/{aspiranteId}")
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    public ResponseEntity<?> getStatsByAspirante(@PathVariable Long aspiranteId) {
        try {
            Map<String, Object> stats = statsService.getStatsByAspirante(aspiranteId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
