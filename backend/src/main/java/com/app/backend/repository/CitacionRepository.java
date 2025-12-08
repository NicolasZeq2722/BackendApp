package com.app.backend.repository;

import com.app.backend.model.Citacion;
import com.app.backend.model.Citacion.EstadoCitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitacionRepository extends JpaRepository<Citacion, Long> {
    List<Citacion> findByPostulacionId(Long postulacionId);
    List<Citacion> findByReclutadorIdOrderByFechaCitacionDesc(Long reclutadorId);
    List<Citacion> findByPostulacionAspiranteId(Long aspiranteId);
    List<Citacion> findByPostulacionOfertaId(Long ofertaId);
    List<Citacion> findByEstado(EstadoCitacion estado);
    List<Citacion> findByActivaTrueOrderByFechaCitacionDesc();
}
