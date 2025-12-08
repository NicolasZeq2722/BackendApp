package com.app.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "ofertas")
public class Oferta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String empresa;

    @Column(nullable = false)
    private Double salario;

    @Column(nullable = false)
    private String ubicacion;

    @Column(nullable = false)
    private String tipoContrato;

    @Column(nullable = false)
    private Integer experienciaRequerida; // en años

    @Column(columnDefinition = "TEXT")
    private String habilidadesRequeridas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOferta estado = EstadoOferta.ACTIVA;

    @ManyToOne
    @JoinColumn(name = "reclutador_id", nullable = false)
    private User reclutador;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean activa = true; // soft delete

    @OneToMany(mappedBy = "oferta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Postulacion> postulaciones;

    public enum EstadoOferta {
        ACTIVA, CERRADA, PAUSADA
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDateTime.now();
    }
}
