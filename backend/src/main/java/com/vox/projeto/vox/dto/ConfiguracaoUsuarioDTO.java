package com.vox.projeto.vox.dto;

import com.vox.projeto.vox.entity.TamanhoPictograma;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracaoUsuarioDTO {

    private Long id;

    @NotNull(message = "Usuário é obrigatório")
    private Long usuarioId;

    @NotNull(message = "Tamanho do pictograma é obrigatório")
    private TamanhoPictograma tamanhoPictograma;

    private Boolean modoAltoContraste;
    private Boolean modoEscuro;
    private Boolean habilitarSom;

    @Min(value = 0, message = "Velocidade deve ser no mínimo 0")
    @Max(value = 2, message = "Velocidade deve ser no máximo 2")
    private Integer velocidadeVoz;

    @Size(max = 10)
    private String idiomaVoz;

    private Boolean modoVarredura;

    @Min(value = 1, message = "Tempo de varredura deve ser no mínimo 1 segundo")
    @Max(value = 10, message = "Tempo de varredura deve ser no máximo 10 segundos")
    private Integer tempoVarredura;

    private Boolean confirmarSelecao;
    private Boolean salvarHistorico;
    private Boolean permitirRelatorios;
    private LocalDateTime atualizadoEm;
}