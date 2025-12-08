package com.app.backend.controller;

import com.app.backend.dto.NotificacionResponse;
import com.app.backend.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacion")
@CrossOrigin(origins = "*")
public class NotificacionController {
    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificacionResponse>> listarNotificaciones(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.listarNotificacionesPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificacionResponse>> listarNotificacionesNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.listarNotificacionesNoLeidas(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/contar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> contarNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.contarNoLeidas(usuarioId));
    }

    @PutMapping("/{id}/leida")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificacionResponse> marcarComoLeida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
    }

    @PutMapping("/usuario/{usuarioId}/todas-leidas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> marcarTodasComoLeida(@PathVariable Long usuarioId) {
        notificacionService.marcarTodosComoLeida(usuarioId);
        return ResponseEntity.ok("Todas las notificaciones marcadas como leídas");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> eliminarNotificacion(@PathVariable Long id) {
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.ok("Notificación eliminada");
    }
}
