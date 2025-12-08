package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaResponse {
    private Long id;
    private String titulo;
    private String descripcion;
    private String empresa;
    private Double salario;
    private String ubicacion;
    private String tipoContrato;
    private Integer experienciaRequerida;
    private String habilidadesRequeridas;
    private String estado;
    private Long reclutadorId;
    private String reclutadorNombre;
}
