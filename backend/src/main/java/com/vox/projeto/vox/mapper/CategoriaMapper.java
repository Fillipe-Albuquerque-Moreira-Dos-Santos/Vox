package com.vox.projeto.vox.mapper;

import com.vox.projeto.vox.dto.CategoriaDTO;
import com.vox.projeto.vox.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaDTO toDTO(Categoria entity) {
        if (entity == null) {
            return null;
        }

        return CategoriaDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .descricao(entity.getDescricao())
                .cor(entity.getCor())
                .icone(entity.getIcone())
                .ativa(entity.getAtiva())
                .padrao(entity.getPadrao())
                .ordem(entity.getOrdem())
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .quantidadePictogramas(entity.getPictogramas() != null ? entity.getPictogramas().size() : 0)
                .criadoEm(entity.getCriadoEm())
                .atualizadoEm(entity.getAtualizadoEm())
                .build();
    }

    public Categoria toEntity(CategoriaDTO dto) {
        if (dto == null) {
            return null;
        }

        return Categoria.builder()
                .id(dto.getId())
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .cor(dto.getCor())
                .icone(dto.getIcone())
                .ativa(dto.getAtiva() != null ? dto.getAtiva() : true)
                .padrao(dto.getPadrao() != null ? dto.getPadrao() : false)
                .ordem(dto.getOrdem() != null ? dto.getOrdem() : 0)
                .build();
    }
}