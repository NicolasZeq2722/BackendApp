package com.app.backend.repository;

import com.app.backend.model.Notificacion;
import com.app.backend.model.Notificacion.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
    List<Notificacion> findByUsuarioIdAndLeidaFalseOrderByFechaCreacionDesc(Long usuarioId);
    int countByUsuarioIdAndLeidaFalse(Long usuarioId);
    List<Notificacion> findByUsuarioIdAndTipo(Long usuarioId, TipoNotificacion tipo);
    
    // ✅ NUEVO: Método para eliminar todas las notificaciones de un usuario
    // Necesario para evitar violación de clave foránea al eliminar usuario
    void deleteAllByUsuarioId(Long usuarioId);
}
