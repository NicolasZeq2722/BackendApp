package com.app.backend.repository;

import com.app.backend.model.Postulacion;
import com.app.backend.model.Postulacion.EstadoPostulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
    List<Postulacion> findByOfertaId(Long ofertaId);
    List<Postulacion> findByAspiranteId(Long aspiranteId);
    List<Postulacion> findByOfertaIdAndEstado(Long ofertaId, EstadoPostulacion estado);
    Optional<Postulacion> findByOfertaIdAndAspiranteId(Long ofertaId, Long aspiranteId);
    
    // ❌ DEPRECATED: Esta consulta retorna postulaciones fantasma de ofertas eliminadas
    // List<Postulacion> findByOfertaReclutadorIdOrderByFechaPostulacionDesc(Long reclutadorId);
    
    // ✅ NUEVO: Consulta segura que filtra por ofertas activas
    // Solo el Reclutador ve sus postulaciones de ofertas NO eliminadas
    @Query("SELECT p FROM Postulacion p " +
           "WHERE p.oferta.reclutador.id = :reclutadorId " +
           "AND p.oferta.activa = true " +
           "ORDER BY p.fechaPostulacion DESC")
    List<Postulacion> findByOfertaReclutadorIdOrderByFechaPostulacionDesc(@Param("reclutadorId") Long reclutadorId);
    
    List<Postulacion> findByActivaTrueOrderByFechaPostulacionDesc();
}
