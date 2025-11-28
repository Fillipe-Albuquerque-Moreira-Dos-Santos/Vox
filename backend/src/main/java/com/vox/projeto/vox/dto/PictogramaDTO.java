package com.vox.projeto.vox.dto;

import com.vox.projeto.vox.entity.TipoPictograma;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PictogramaDTO {

    private Long id;

    @NotBlank(message = "Label é obrigatório")
    @Size(max = 100)
    private String label;

    @Size(max = 200)
    private String labelAlternativo;

    @NotBlank(message = "Cor é obrigatória")
    @Size(max = 50)
    private String cor;

    @Size(max = 100)
    private String icone;

    @Size(max = 1000)
    private String imagemUrl;

    @NotNull(message = "Tipo é obrigatório")
    private TipoPictograma tipo;

    private Boolean ativo;
    private Boolean padrao;
    private Integer ordem;
    private Integer vezesUsado;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;

    private String categoriaNome;
    private String categoriaCor;
    private Long usuarioId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
