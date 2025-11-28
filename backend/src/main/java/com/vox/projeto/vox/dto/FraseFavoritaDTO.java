package com.vox.projeto.vox.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraseFavoritaDTO {

    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200)
    private String titulo;

    @NotBlank(message = "Conteúdo JSON é obrigatório")
    private String conteudoJson;

    @NotBlank(message = "Texto completo é obrigatório")
    private String textoCompleto;

    private Boolean ativa;
    private Integer ordem;
    private Integer vezesUsada;
    private Long usuarioId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}