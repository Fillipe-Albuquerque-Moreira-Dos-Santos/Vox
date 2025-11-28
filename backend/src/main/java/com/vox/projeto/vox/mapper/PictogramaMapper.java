package com.vox.projeto.vox.mapper;

import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.entity.Pictograma;
import org.springframework.stereotype.Component;

@Component
public class PictogramaMapper {

    public PictogramaDTO toDTO(Pictograma entity) {
        if (entity == null) {
            return null;
        }

        return PictogramaDTO.builder()
                .id(entity.getId())
                .label(entity.getLabel())
                .labelAlternativo(entity.getLabelAlternativo())
                .cor(entity.getCor())
                .icone(entity.getIcone())
                .imagemUrl(entity.getImagemUrl())
                .tipo(entity.getTipo())
                .ativo(entity.getAtivo())
                .padrao(entity.getPadrao())
                .ordem(entity.getOrdem())
                .vezesUsado(entity.getVezesUsado())
                .categoriaId(entity.getCategoria() != null ? entity.getCategoria().getId() : null)
                .categoriaNome(entity.getCategoria() != null ? entity.getCategoria().getNome() : null)
                .categoriaCor(entity.getCategoria() != null ? entity.getCategoria().getCor() : null)
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .criadoEm(entity.getCriadoEm())
                .atualizadoEm(entity.getAtualizadoEm())
                .build();
    }

    public Pictograma toEntity(PictogramaDTO dto) {
        if (dto == null) {
            return null;
        }

        return Pictograma.builder()
                .id(dto.getId())
                .label(dto.getLabel())
                .labelAlternativo(dto.getLabelAlternativo())
                .cor(dto.getCor())
                .icone(dto.getIcone())
                .imagemUrl(dto.getImagemUrl())
                .tipo(dto.getTipo())
                .ativo(dto.getAtivo() != null ? dto.getAtivo() : true)
                .padrao(dto.getPadrao() != null ? dto.getPadrao() : false)
                .ordem(dto.getOrdem() != null ? dto.getOrdem() : 0)
                .vezesUsado(dto.getVezesUsado() != null ? dto.getVezesUsado() : 0)
                .build();
    }
}