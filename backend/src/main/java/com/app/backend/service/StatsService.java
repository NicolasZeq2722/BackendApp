package com.app.backend.service;

import com.app.backend.model.*;
import com.app.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class StatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private CitacionRepository citacionRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    /**
     * Obtiene estadísticas generales del sistema para el administrador
     * @return Map con todas las estadísticas
     */
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Estadísticas de Usuarios
        stats.put("totalUsuarios", userRepository.count());
        stats.put("totalAspirantes", countByRole(User.Role.ASPIRANTE));
        stats.put("totalReclutadores", countByRole(User.Role.RECLUTADOR));
        stats.put("totalAdmins", countByRole(User.Role.ADMIN));

        // Estadísticas de Ofertas
        stats.put("totalOfertas", ofertaRepository.count());
        stats.put("ofertasActivas", countOfertasByStatus(Oferta.EstadoOferta.ACTIVA));
        stats.put("ofertasCerradas", countOfertasByStatus(Oferta.EstadoOferta.CERRADA));
        stats.put("ofertasPausadas", countOfertasByStatus(Oferta.EstadoOferta.PAUSADA));

        // Estadísticas de Postulaciones
        stats.put("totalPostulaciones", postulacionRepository.count());
        stats.put("postulacionesEnviadas", countPostulacionesByStatus(Postulacion.EstadoPostulacion.ENVIADA));
        stats.put("postulacionesRevisadas", countPostulacionesByStatus(Postulacion.EstadoPostulacion.REVISADA));
        stats.put("postulacionesPreseleccionadas", countPostulacionesByStatus(Postulacion.EstadoPostulacion.PRESELECCIONADA));
        stats.put("postulacionesAceptadas", countPostulacionesByStatus(Postulacion.EstadoPostulacion.ACEPTADA));
        stats.put("postulacionesRechazadas", countPostulacionesByStatus(Postulacion.EstadoPostulacion.RECHAZADA));

        // Estadísticas de Citaciones
        stats.put("totalCitaciones", citacionRepository.count());
        stats.put("citacionesPendientes", countCitacionesByStatus(Citacion.EstadoCitacion.PENDIENTE));
        stats.put("citacionesConfirmadas", countCitacionesByStatus(Citacion.EstadoCitacion.CONFIRMADA));
        stats.put("citacionesAsistio", countCitacionesByStatus(Citacion.EstadoCitacion.ASISTIO));
        stats.put("citacionesNoAsistio", countCitacionesByStatus(Citacion.EstadoCitacion.NO_ASISTIO));
        stats.put("citacionesCanceladas", countCitacionesByStatus(Citacion.EstadoCitacion.CANCELADA));

        // Estadísticas de Notificaciones
        stats.put("totalNotificaciones", notificacionRepository.count());
        stats.put("notificacionesNoLeidas", countNotificacionesNoLeidas());

        // Tasa de conversión
        long totalPostulaciones = postulacionRepository.count();
        long postulacionesAceptadas = countPostulacionesByStatus(Postulacion.EstadoPostulacion.ACEPTADA);
        if (totalPostulaciones > 0) {
            stats.put("tasaConversion", (postulacionesAceptadas * 100.0) / totalPostulaciones);
        } else {
            stats.put("tasaConversion", 0.0);
        }

        return stats;
    }

    /**
     * Obtiene estadísticas detalladas por reclutador
     * @param reclutadorId ID del reclutador
     * @return Map con estadísticas del reclutador
     */
    public Map<String, Object> getStatsByReclutador(Long reclutadorId) {
        Map<String, Object> stats = new HashMap<>();

        // Ofertas del reclutador
        List<Oferta> ofertas = ofertaRepository.findByReclutadorId(reclutadorId);
        stats.put("totalOfertas", ofertas.size());
        stats.put("ofertasActivas", ofertas.stream()
                .filter(o -> o.getEstado() == Oferta.EstadoOferta.ACTIVA)
                .count());
        stats.put("ofertasCerradas", ofertas.stream()
                .filter(o -> o.getEstado() == Oferta.EstadoOferta.CERRADA)
                .count());

        // Postulaciones recibidas
        long totalPostulacionesRecibidas = 0;
        for (Oferta oferta : ofertas) {
            totalPostulacionesRecibidas += postulacionRepository.findByOfertaId(oferta.getId()).size();
        }
        stats.put("totalPostulacionesRecibidas", totalPostulacionesRecibidas);

        // Citaciones creadas
        List<Citacion> citaciones = citacionRepository.findByReclutadorIdOrderByFechaCitacionDesc(reclutadorId);
        stats.put("totalCitacionesCreadas", citaciones.size());
        stats.put("citacionesConfirmadas", citaciones.stream()
                .filter(c -> c.getEstado() == Citacion.EstadoCitacion.CONFIRMADA)
                .count());

        return stats;
    }

    /**
     * Obtiene estadísticas del aspirante
     * @param aspiranteId ID del aspirante
     * @return Map con estadísticas del aspirante
     */
    public Map<String, Object> getStatsByAspirante(Long aspiranteId) {
        Map<String, Object> stats = new HashMap<>();

        // Postulaciones del aspirante
        List<Postulacion> postulaciones = postulacionRepository.findByAspiranteId(aspiranteId);
        stats.put("totalPostulaciones", postulaciones.size());
        stats.put("postulacionesAceptadas", postulaciones.stream()
                .filter(p -> p.getEstado() == Postulacion.EstadoPostulacion.ACEPTADA)
                .count());
        stats.put("postulacionesRechazadas", postulaciones.stream()
                .filter(p -> p.getEstado() == Postulacion.EstadoPostulacion.RECHAZADA)
                .count());
        stats.put("postulacionesEnProceso", postulaciones.stream()
                .filter(p -> p.getEstado() != Postulacion.EstadoPostulacion.ACEPTADA &&
                        p.getEstado() != Postulacion.EstadoPostulacion.RECHAZADA)
                .count());

        // Citaciones del aspirante
        long totalCitaciones = 0;
        for (Postulacion postulacion : postulaciones) {
            totalCitaciones += citacionRepository.findByPostulacionId(postulacion.getId()).size();
        }
        stats.put("totalCitaciones", totalCitaciones);

        return stats;
    }

    // ==================== Métodos auxiliares ====================

    private long countByRole(User.Role role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .count();
    }

    private long countOfertasByStatus(Oferta.EstadoOferta estado) {
        return ofertaRepository.findAll().stream()
                .filter(o -> o.getEstado() == estado)
                .count();
    }

    private long countPostulacionesByStatus(Postulacion.EstadoPostulacion estado) {
        return postulacionRepository.findAll().stream()
                .filter(p -> p.getEstado() == estado)
                .count();
    }

    private long countCitacionesByStatus(Citacion.EstadoCitacion estado) {
        return citacionRepository.findAll().stream()
                .filter(c -> c.getEstado() == estado)
                .count();
    }

    private long countNotificacionesNoLeidas() {
        return notificacionRepository.findAll().stream()
                .filter(n -> !n.getLeida())
                .count();
    }
}
