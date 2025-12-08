package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostulacionResponse {
    private Long id;
    private Long ofertaId;
    private String ofertaTitulo;
    private Long aspiranteId;
    private String aspiranteNombre;
    private String estado;
    private String fechaPostulacion;
    private String comentarios;
}
