package com.app.backend.service;

import com.app.backend.dto.OfertaCreateRequest;
import com.app.backend.dto.OfertaResponse;
import com.app.backend.model.Oferta;
import com.app.backend.model.User;
import com.app.backend.repository.OfertaRepository;
import com.app.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfertaService {
    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private UserRepository userRepository;

    public OfertaResponse crearOferta(OfertaCreateRequest request, Long reclutadorId) {
        User reclutador = userRepository.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));

        if (!reclutador.getRole().equals(User.Role.RECLUTADOR) && 
            !reclutador.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Solo reclutadores pueden crear ofertas");
        }

        Oferta oferta = new Oferta();
        oferta.setTitulo(request.getTitulo());
        oferta.setDescripcion(request.getDescripcion());
        oferta.setEmpresa(request.getEmpresa());
        oferta.setSalario(request.getSalario());
        oferta.setUbicacion(request.getUbicacion());
        oferta.setTipoContrato(request.getTipoContrato());
        oferta.setExperienciaRequerida(request.getExperienciaRequerida());
        oferta.setHabilidadesRequeridas(request.getHabilidadesRequeridas());
        oferta.setReclutador(reclutador);
        oferta.setEstado(Oferta.EstadoOferta.ACTIVA);

        Oferta guardada = ofertaRepository.save(oferta);
        return mapToResponse(guardada);
    }

    public OfertaResponse obtenerOferta(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        
        if (!oferta.getActiva()) {
            throw new RuntimeException("Oferta no disponible");
        }
        
        return mapToResponse(oferta);
    }

    public List<OfertaResponse> listarOfertasActivas() {
        return ofertaRepository.findByEstadoAndActivaTrue(Oferta.EstadoOferta.ACTIVA)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ NUEVO: Método para listar ofertas según el rol del usuario
    // Se usa en el endpoint GET /api/oferta para filtrar basado en el rol
    public List<OfertaResponse> listarOfertasPorRol(String roleName, String username) {
        try {
            User.Role role = User.Role.valueOf(roleName.toUpperCase());
            
            switch (role) {
                case ADMIN:
                    // Admin ve TODAS las ofertas activas
                    return ofertaRepository.findByActivaTrue()
                            .stream()
                            .map(this::mapToResponse)
                            .collect(Collectors.toList());
                
                case RECLUTADOR:
                    // Reclutador ve SOLO sus propias ofertas
                    return ofertaRepository.findByReclutadorUsername(username)
                            .stream()
                            .map(this::mapToResponse)
                            .collect(Collectors.toList());
                
                case ASPIRANTE:
                    // Aspirante ve SOLO ofertas activas y disponibles
                    return ofertaRepository.findByEstadoAndActivaTrue(Oferta.EstadoOferta.ACTIVA)
                            .stream()
                            .map(this::mapToResponse)
                            .collect(Collectors.toList());
                
                default:
                    return new java.util.ArrayList<>();
            }
        } catch (IllegalArgumentException e) {
            // Si el rol no existe, retornar lista vacía
            return new java.util.ArrayList<>();
        }
    }

    public List<OfertaResponse> listarOfertasPorReclutador(Long reclutadorId) {
        return ofertaRepository.findByReclutadorId(reclutadorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OfertaResponse> buscarOfertasPorTitulo(String titulo) {
        return ofertaRepository.findByTituloContainingIgnoreCaseAndActivaTrue(titulo)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OfertaResponse> buscarOfertasPorUbicacion(String ubicacion) {
        return ofertaRepository.findByUbicacionContainingIgnoreCaseAndActivaTrue(ubicacion)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OfertaResponse actualizarOferta(Long id, OfertaCreateRequest request, Long reclutadorId) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

        User reclutador = userRepository.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));

        // ✅ Permitir editar si:
        // 1. El usuario es el propietario de la oferta, O
        // 2. El usuario tiene rol ADMIN
        if (!oferta.getReclutador().getId().equals(reclutadorId) && 
            !reclutador.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("No tienes permisos para editar esta oferta");
        }

        oferta.setTitulo(request.getTitulo());
        oferta.setDescripcion(request.getDescripcion());
        oferta.setEmpresa(request.getEmpresa());
        oferta.setSalario(request.getSalario());
        oferta.setUbicacion(request.getUbicacion());
        oferta.setTipoContrato(request.getTipoContrato());
        oferta.setExperienciaRequerida(request.getExperienciaRequerida());
        oferta.setHabilidadesRequeridas(request.getHabilidadesRequeridas());

        return mapToResponse(ofertaRepository.save(oferta));
    }

    public void eliminarOferta(Long id, Long reclutadorId) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));

        User reclutador = userRepository.findById(reclutadorId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));

        // ✅ Permitir eliminar si:
        // 1. El usuario es el propietario de la oferta, O
        // 2. El usuario tiene rol ADMIN
        if (!oferta.getReclutador().getId().equals(reclutadorId) && 
            !reclutador.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("No tienes permisos para eliminar esta oferta");
        }

        oferta.setActiva(false);
        ofertaRepository.save(oferta);
    }

    private OfertaResponse mapToResponse(Oferta oferta) {
        return new OfertaResponse(
            oferta.getId(),
            oferta.getTitulo(),
            oferta.getDescripcion(),
            oferta.getEmpresa(),
            oferta.getSalario(),
            oferta.getUbicacion(),
            oferta.getTipoContrato(),
            oferta.getExperienciaRequerida(),
            oferta.getHabilidadesRequeridas(),
            oferta.getEstado().toString(),
            oferta.getReclutador().getId(),
            oferta.getReclutador().getUsername()
        );
    }
}
