package com.vox.projeto.vox.mapper;

import com.vox.projeto.vox.dto.FraseFavoritaDTO;
import com.vox.projeto.vox.entity.FraseFavorita;
import org.springframework.stereotype.Component;

@Component
public class FraseFavoritaMapper {

    public FraseFavoritaDTO toDTO(FraseFavorita entity) {
        if (entity == null) {
            return null;
        }

        return FraseFavoritaDTO.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .conteudoJson(entity.getConteudoJson())
                .textoCompleto(entity.getTextoCompleto())
                .ativa(entity.getAtiva())
                .ordem(entity.getOrdem())
                .vezesUsada(entity.getVezesUsada())
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .criadoEm(entity.getCriadoEm())
                .atualizadoEm(entity.getAtualizadoEm())
                .build();
    }

    public FraseFavorita toEntity(FraseFavoritaDTO dto) {
        if (dto == null) {
            return null;
        }

        return FraseFavorita.builder()
                .id(dto.getId())
                .titulo(dto.getTitulo())
                .conteudoJson(dto.getConteudoJson())
                .textoCompleto(dto.getTextoCompleto())
                .ativa(dto.getAtiva() != null ? dto.getAtiva() : true)
                .ordem(dto.getOrdem() != null ? dto.getOrdem() : 0)
                .vezesUsada(dto.getVezesUsada() != null ? dto.getVezesUsada() : 0)
                .build();
    }
}
