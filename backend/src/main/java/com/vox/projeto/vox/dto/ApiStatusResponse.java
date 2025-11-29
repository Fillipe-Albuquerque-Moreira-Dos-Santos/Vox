package com.vox.projeto.vox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiStatusResponse {
    private boolean disponivel;
    private String fonte;
    private String mensagem;
}