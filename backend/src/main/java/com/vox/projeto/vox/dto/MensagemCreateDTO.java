package com.vox.projeto.vox.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensagemCreateDTO {

    @NotBlank(message = "Conteúdo JSON é obrigatório")
    private String conteudoJson;

    @NotBlank(message = "Texto completo é obrigatório")
    private String textoCompleto;

    @Size(max = 500)
    private String contexto;

    @Size(max = 50)
    private String dispositivoOrigem;
}