package com.vox.projeto.vox.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaComPictogramasDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String cor;
    private String icone;
    private Boolean ativa;
    private Integer ordem;
    private List<PictogramaDTO> pictogramas;
}