package com.vox.projeto.vox.mapper;

import com.vox.projeto.vox.dto.MensagemDTO;
import com.vox.projeto.vox.entity.Mensagem;
import org.springframework.stereotype.Component;

@Component
public class MensagemMapper {

    public MensagemDTO toDTO(Mensagem entity) {
        if (entity == null) {
            return null;
        }

        return MensagemDTO.builder()
                .id(entity.getId())
                .conteudoJson(entity.getConteudoJson())
                .textoCompleto(entity.getTextoCompleto())
                .contexto(entity.getContexto())
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .usuarioNome(entity.getUsuario() != null ? entity.getUsuario().getNome() : null)
                .criadoEm(entity.getCriadoEm())
                .favorita(entity.getFavorita())
                .vezesReutilizada(entity.getVezesReutilizada())
                .dispositivoOrigem(entity.getDispositivoOrigem())
                .build();
    }

    public Mensagem toEntity(MensagemDTO dto) {
        if (dto == null) {
            return null;
        }

        return Mensagem.builder()
                .id(dto.getId())
                .conteudoJson(dto.getConteudoJson())
                .textoCompleto(dto.getTextoCompleto())
                .contexto(dto.getContexto())
                .favorita(dto.getFavorita() != null ? dto.getFavorita() : false)
                .vezesReutilizada(dto.getVezesReutilizada() != null ? dto.getVezesReutilizada() : 0)
                .dispositivoOrigem(dto.getDispositivoOrigem())
                .build();
    }
}