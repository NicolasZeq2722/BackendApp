package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitacionResponse {
    private Long id;
    private Long postulacionId;
    private Long reclutadorId;
    private String reclutadorNombre;
    private String fechaCitacion;
    private String hora;
    private String detallesCitacion;
    private String observaciones;
    private String linkMeet;
    private String estado;
    private Boolean mensajeEnviado;
}
