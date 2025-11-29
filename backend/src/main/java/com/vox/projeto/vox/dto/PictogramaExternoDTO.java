package com.vox.projeto.vox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para pictogramas de APIs externas (ARASAAC, Sclera, etc)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PictogramaExternoDTO {

    /**
     * ID do pictograma na API externa
     */
    private Long idExterno;

    /**
     * Fonte do pictograma (ARASAAC, SCLERA, MULBERRY, etc)
     */
    private String fonte;

    /**
     * Label principal do pictograma
     */
    private String label;

    /**
     * Sinônimos e palavras alternativas
     */
    private String labelAlternativo;

    /**
     * URL da imagem (PNG padrão)
     */
    private String imagemUrl;

    /**
     * URL da imagem colorida (se disponível)
     */
    private String imagemUrlColorida;

    /**
     * URL da imagem em alta resolução
     */
    private String imagemUrlAlta;

    /**
     * Categorias do pictograma
     */
    private List<String> categorias;

    /**
     * Palavras-chave para busca
     */
    private List<String> keywords;

    /**
     * Indica se já foi importado para o sistema
     */
    private Boolean importado;

    /**
     * ID do pictograma no sistema VOX (se importado)
     */
    private Long pictogramaVoxId;
}