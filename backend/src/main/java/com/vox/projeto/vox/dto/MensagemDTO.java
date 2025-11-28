package com.vox.projeto.vox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensagemDTO {

    private Long id;
    private String conteudoJson;
    private String textoCompleto;
    private String contexto;
    private Long usuarioId;
    private String usuarioNome;
    private LocalDateTime criadoEm;
    private Boolean favorita;
    private Integer vezesReutilizada;
    private String dispositivoOrigem;
}