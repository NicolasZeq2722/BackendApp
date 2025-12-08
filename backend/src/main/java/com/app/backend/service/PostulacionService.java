package com.app.backend.service;

import com.app.backend.dto.PostulacionResponse;
import com.app.backend.model.Oferta;
import com.app.backend.model.Postulacion;
import com.app.backend.model.User;
import com.app.backend.repository.NotificacionRepository;
import com.app.backend.repository.OfertaRepository;
import com.app.backend.repository.PostulacionRepository;
import com.app.backend.repository.UserRepository;
import com.app.backend.model.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostulacionService {
    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    public PostulacionResponse postularse(Long ofertaId, Long aspiranteId) {
        Oferta oferta = ofertaRepository.findById(ofertaId)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

        User aspirante = userRepository.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        if (!aspirante.getRole().equals(User.Role.ASPIRANTE)) {
            throw new RuntimeException("Solo aspirantes pueden postularse");
        }

        // Verificar que no se haya postulado ya
        if (postulacionRepository.findByOfertaIdAndAspiranteId(ofertaId, aspiranteId).isPresent()) {
            throw new RuntimeException("Ya te has postulado a esta oferta");
        }

        Postulacion postulacion = new Postulacion();
        postulacion.setOferta(oferta);
        postulacion.setAspirante(aspirante);
        postulacion.setEstado(Postulacion.EstadoPostulacion.ENVIADA);

        Postulacion guardada = postulacionRepository.save(postulacion);

        // Crear notificación para el reclutador
        crearNotificacion(oferta.getReclutador().getId(),
                "Nueva postulación",
                aspirante.getUsername() + " se ha postulado para " + oferta.getTitulo(),
                Notificacion.TipoNotificacion.POSTULACION);

        return mapToResponse(guardada);
    }

    public PostulacionResponse obtenerPostulacion(Long id) {
        Postulacion postulacion = postulacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));
        return mapToResponse(postulacion);
    }

    public List<PostulacionResponse> listarPostulacionesPorOferta(Long ofertaId) {
        return postulacionRepository.findByOfertaId(ofertaId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PostulacionResponse> listarPostulacionesPorAspirante(Long aspiranteId) {
        return postulacionRepository.findByAspiranteId(aspiranteId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PostulacionResponse> listarPostulacionesPorReclutador(Long reclutadorId) {
        return postulacionRepository.findByOfertaReclutadorIdOrderByFechaPostulacionDesc(reclutadorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PostulacionResponse cambiarEstado(Long id, String nuevoEstado, Long reclutadorId) {
        Postulacion postulacion = postulacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        if (!postulacion.getOferta().getReclutador().getId().equals(reclutadorId)) {
            throw new RuntimeException("No tienes permisos para cambiar el estado");
        }

        Postulacion.EstadoPostulacion estado = Postulacion.EstadoPostulacion.valueOf(nuevoEstado);
        postulacion.setEstado(estado);

        Postulacion actualizada = postulacionRepository.save(postulacion);

        // Crear notificación para el aspirante
        crearNotificacion(postulacion.getAspirante().getId(),
                "Cambio de estado en postulación",
                "Tu postulación a " + postulacion.getOferta().getTitulo() + " ha cambiado a: " + estado,
                Notificacion.TipoNotificacion.CAMBIO_ESTADO);

        return mapToResponse(actualizada);
    }

    public void eliminarPostulacion(Long id, Long aspiranteId) {
        Postulacion postulacion = postulacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        if (!postulacion.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta postulación");
        }

        postulacion.setActiva(false);
        postulacionRepository.save(postulacion);
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

    private PostulacionResponse mapToResponse(Postulacion postulacion) {
        return new PostulacionResponse(
            postulacion.getId(),
            postulacion.getOferta().getId(),
            postulacion.getOferta().getTitulo(),
            postulacion.getAspirante().getId(),
            postulacion.getAspirante().getUsername(),
            postulacion.getEstado().toString(),
            postulacion.getFechaPostulacion().toString(),
            postulacion.getComentarios()
        );
    }
}
