package com.app.backend.service;

import com.app.backend.dto.NotificacionResponse;
import com.app.backend.model.Notificacion;
import com.app.backend.model.User;
import com.app.backend.repository.NotificacionRepository;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionService {
    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UserRepository userRepository;

    public NotificacionResponse obtenerNotificacion(Long id) {
        Notificacion notif = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        return mapToResponse(notif);
    }

    public List<NotificacionResponse> listarNotificacionesPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NotificacionResponse> listarNotificacionesNoLeidas(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaFalseOrderByFechaCreacionDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public int contarNoLeidas(Long usuarioId) {
        return notificacionRepository.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    public NotificacionResponse marcarComoLeida(Long id) {
        Notificacion notif = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notif.setLeida(true);
        return mapToResponse(notificacionRepository.save(notif));
    }

    public void marcarTodosComoLeida(Long usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository
                .findByUsuarioIdAndLeidaFalseOrderByFechaCreacionDesc(usuarioId);
        notificaciones.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(notificaciones);
    }

    public void eliminarNotificacion(Long id) {
        notificacionRepository.deleteById(id);
    }

    private NotificacionResponse mapToResponse(Notificacion notif) {
        return new NotificacionResponse(
            notif.getId(),
            notif.getTitulo(),
            notif.getMensaje(),
            notif.getTipo().toString(),
            notif.getLeida(),
            notif.getFechaCreacion().toString(),
            notif.getEnlace()
        );
    }
}
