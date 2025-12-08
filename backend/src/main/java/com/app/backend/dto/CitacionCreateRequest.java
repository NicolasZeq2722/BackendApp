package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitacionCreateRequest {
    private Long postulacionId;
    private Long reclutadorId;
    private String fechaCitacion;
    private String hora;
    private String linkMeet;
    private String detallesCitacion;
    private String observaciones;
}
