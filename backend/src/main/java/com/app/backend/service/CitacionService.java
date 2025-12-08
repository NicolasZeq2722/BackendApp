package com.app.backend.service;

import com.app.backend.dto.CitacionCreateRequest;
import com.app.backend.dto.CitacionResponse;
import com.app.backend.model.Citacion;
import com.app.backend.model.Postulacion;
import com.app.backend.model.User;
import com.app.backend.model.Notificacion;
import com.app.backend.repository.CitacionRepository;
import com.app.backend.repository.NotificacionRepository;
import com.app.backend.repository.PostulacionRepository;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitacionService {
    @Autowired
    private CitacionRepository citacionRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private EmailService emailService;

    public CitacionResponse crearCitacion(CitacionCreateRequest request, Long reclutadorId) {
        Postulacion postulacion = postulacionRepository.findById(request.getPostulacionId())
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        User reclutador = userRepository.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));

        if (!postulacion.getOferta().getReclutador().getId().equals(reclutadorId)) {
            throw new RuntimeException("No tienes permisos para crear esta citación");
        }

        Citacion citacion = new Citacion();
        citacion.setPostulacion(postulacion);
        citacion.setReclutador(reclutador);
        citacion.setFechaCitacion(LocalDate.parse(request.getFechaCitacion()));
        citacion.setHora(request.getHora());
        citacion.setDetallesCitacion(request.getDetallesCitacion());
        citacion.setObservaciones(request.getObservaciones());
        citacion.setLinkMeet(request.getLinkMeet());
        citacion.setEstado(Citacion.EstadoCitacion.PENDIENTE);

        Citacion guardada = citacionRepository.save(citacion);

        // Intentar enviar email
        try {
            enviarCitacionPorEmail(guardada);
        } catch (Exception e) {
            // Log pero no falla
            System.err.println("Error enviando email: " + e.getMessage());
        }

        return mapToResponse(guardada);
    }

    public CitacionResponse obtenerCitacion(Long id, Long usuarioId) {
        Citacion citacion = citacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citación no encontrada"));

        if (!citacion.getActiva()) {
            throw new RuntimeException("Citación no disponible");
        }

        // Validar acceso
        User usuario = userRepository.findById(usuarioId).orElse(null);
        if (usuario != null) {
            if (usuario.getRole().equals(User.Role.ASPIRANTE)) {
                if (!citacion.getPostulacion().getAspirante().getId().equals(usuarioId)) {
                    throw new RuntimeException("No tienes permisos para ver esta citación");
                }
            } else if (usuario.getRole().equals(User.Role.RECLUTADOR)) {
                if (!citacion.getReclutador().getId().equals(usuarioId)) {
                    throw new RuntimeException("No tienes permisos para ver esta citación");
                }
            }
        }

        return mapToResponse(citacion);
    }

    public List<CitacionResponse> listarCitacionesPorReclutador(Long reclutadorId) {
        return citacionRepository.findByReclutadorIdOrderByFechaCitacionDesc(reclutadorId)
                .stream()
                .filter(Citacion::getActiva)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CitacionResponse> listarCitacionesPorAspirante(Long aspiranteId) {
        return citacionRepository.findByPostulacionAspiranteId(aspiranteId)
                .stream()
                .filter(Citacion::getActiva)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CitacionResponse cambiarEstado(Long id, String nuevoEstado, Long reclutadorId) {
        Citacion citacion = citacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citación no encontrada"));

        if (!citacion.getReclutador().getId().equals(reclutadorId)) {
            throw new RuntimeException("No tienes permisos para cambiar el estado");
        }

        Citacion.EstadoCitacion estado = Citacion.EstadoCitacion.valueOf(nuevoEstado);
        citacion.setEstado(estado);

        Citacion actualizada = citacionRepository.save(citacion);

        // Notificar aspirante
        crearNotificacion(citacion.getPostulacion().getAspirante().getId(),
                "Cambio de estado en citación",
                "Tu citación ha cambiado a: " + estado,
                Notificacion.TipoNotificacion.CITACION);

        return mapToResponse(actualizada);
    }

    public void eliminarCitacion(Long id, Long reclutadorId) {
        Citacion citacion = citacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citación no encontrada"));

        if (!citacion.getReclutador().getId().equals(reclutadorId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta citación");
        }

        citacion.setActiva(false);
        citacionRepository.save(citacion);
    }

    private void enviarCitacionPorEmail(Citacion citacion) {
        String email = citacion.getPostulacion().getAspirante().getEmail();
        String nombre = citacion.getPostulacion().getAspirante().getUsername();
        String titulo = citacion.getPostulacion().getOferta().getTitulo();

        String asunto = "Citación para " + titulo;
        String contenido = "Hola " + nombre + ",\n\n" +
                "Te citamos para una entrevista:\n" +
                "Fecha: " + citacion.getFechaCitacion() + "\n" +
                "Hora: " + citacion.getHora() + "\n" +
                "Enlace: " + citacion.getLinkMeet() + "\n" +
                "Detalles: " + citacion.getDetallesCitacion();

        emailService.enviarEmail(email, asunto, contenido);

        citacion.setMensajeEnviado(true);
        citacion.setFechaEnvio(LocalDateTime.now());
        citacionRepository.save(citacion);

        // Crear notificación
        crearNotificacion(citacion.getPostulacion().getAspirante().getId(),
                "Nueva citación",
                "Has recibido una nueva citación para " + titulo,
                Notificacion.TipoNotificacion.CITACION);
    }

    private void crearNotificacion(Long usuarioId, String titulo, String mensaje, Notificacion.TipoNotificacion tipo) {
        User usuario = userRepository.findById(usuarioId).orElse(null);
        if (usuario != null) {
            Notificacion notif = new Notificacion();
            notif.setUsuario(usuario);
            notif.setTitulo(titulo);
            notif.setMensaje(mensaje);
            notif.setTipo(tipo);
            notif.setLeida(false);
            notificacionRepository.save(notif);
        }
    }

    private CitacionResponse mapToResponse(Citacion citacion) {
        return new CitacionResponse(
            citacion.getId(),
            citacion.getPostulacion().getId(),
            citacion.getReclutador().getId(),
            citacion.getReclutador().getUsername(),
            citacion.getFechaCitacion().toString(),
            citacion.getHora(),
            citacion.getDetallesCitacion(),
            citacion.getObservaciones(),
            citacion.getLinkMeet(),
            citacion.getEstado().toString(),
            citacion.getMensajeEnviado()
        );
    }
}
