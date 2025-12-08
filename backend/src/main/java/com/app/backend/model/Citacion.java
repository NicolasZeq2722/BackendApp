package com.app.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "citaciones")
public class Citacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "postulacion_id", nullable = false)
    private Postulacion postulacion;

    @ManyToOne
    @JoinColumn(name = "reclutador_id")
    private User reclutador;

    @Column(nullable = false)
    private LocalDate fechaCitacion;

    @Column(nullable = false)
    private String hora;

    @Column(columnDefinition = "TEXT")
    private String detallesCitacion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private String linkMeet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCitacion estado = EstadoCitacion.PENDIENTE;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean mensajeEnviado = false;

    @Column(nullable = false)
    private Boolean activa = true; // soft delete

    public enum EstadoCitacion {
        PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA
    }

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoCitacion.PENDIENTE;
        }
        if (mensajeEnviado == null) {
            mensajeEnviado = false;
        }
        if (activa == null) {
            activa = true;
        }
    }
}
