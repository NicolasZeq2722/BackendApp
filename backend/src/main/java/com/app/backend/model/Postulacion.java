package com.app.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "postulaciones")
public class Postulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "oferta_id", nullable = false)
    private Oferta oferta;

    @ManyToOne
    @JoinColumn(name = "aspirante_id", nullable = false)
    private User aspirante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPostulacion estado = EstadoPostulacion.ENVIADA;

    @Column(name = "fecha_postulacion")
    private LocalDateTime fechaPostulacion = LocalDateTime.now();

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    @Column(nullable = false)
    private Boolean activa = true; // soft delete

    @OneToMany(mappedBy = "postulacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Citacion> citaciones;

    public enum EstadoPostulacion {
        ENVIADA, REVISADA, PRESELECCIONADA, RECHAZADA, ACEPTADA
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDateTime.now();
    }
}
