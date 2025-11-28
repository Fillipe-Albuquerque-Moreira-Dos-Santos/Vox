package com.vox.projeto.vox.dto;

import com.vox.projeto.vox.entity.TipoPictograma;
import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PictogramaCreateDTO {

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

    private Integer ordem;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;
}