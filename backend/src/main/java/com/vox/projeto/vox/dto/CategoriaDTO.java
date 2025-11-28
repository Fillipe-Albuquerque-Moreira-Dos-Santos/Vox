package com.vox.projeto.vox.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDTO {

    private Long id;

    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotBlank(message = "Cor é obrigatória")
    @Size(max = 50)
    private String cor;

    @Size(max = 50)
    private String icone;

    private Boolean ativa;
    private Boolean padrao;
    private Integer ordem;
    private Long usuarioId;
    private Integer quantidadePictogramas;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}