package com.vox.projeto.vox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstatisticasDTO {

    private Long totalMensagens;
    private Long mensagensNoPeriodo;
}