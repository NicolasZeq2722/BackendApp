package com.app.backend.repository;

import com.app.backend.model.Postulacion;
import com.app.backend.model.Postulacion.EstadoPostulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
    List<Postulacion> findByOfertaId(Long ofertaId);
    List<Postulacion> findByAspiranteId(Long aspiranteId);
    List<Postulacion> findByOfertaIdAndEstado(Long ofertaId, EstadoPostulacion estado);
    Optional<Postulacion> findByOfertaIdAndAspiranteId(Long ofertaId, Long aspiranteId);
    List<Postulacion> findByOfertaReclutadorIdOrderByFechaPostulacionDesc(Long reclutadorId);
    List<Postulacion> findByActivaTrueOrderByFechaPostulacionDesc();
}
