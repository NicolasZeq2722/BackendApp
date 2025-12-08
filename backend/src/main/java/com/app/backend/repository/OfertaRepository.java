package com.app.backend.repository;

import com.app.backend.model.Oferta;
import com.app.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    List<Oferta> findByReclutadorId(Long reclutadorId);
    List<Oferta> findByReclutadorUsername(String username);
    List<Oferta> findByEstadoAndActivaTrue(Oferta.EstadoOferta estado);
    List<Oferta> findByActivaTrueOrderByFechaCreacionDesc();
    List<Oferta> findByActivaTrue();
    List<Oferta> findByTituloContainingIgnoreCaseAndActivaTrue(String titulo);
    List<Oferta> findByUbicacionContainingIgnoreCaseAndActivaTrue(String ubicacion);
}
