package com.vox.projeto.vox.mapper;

import com.vox.projeto.vox.dto.ConfiguracaoUsuarioDTO;
import com.vox.projeto.vox.entity.ConfiguracaoUsuario;
import org.springframework.stereotype.Component;

@Component
public class ConfiguracaoUsuarioMapper {

    public ConfiguracaoUsuarioDTO toDTO(ConfiguracaoUsuario entity) {
        if (entity == null) {
            return null;
        }

        return ConfiguracaoUsuarioDTO.builder()
                .id(entity.getId())
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .tamanhoPictograma(entity.getTamanhoPictograma())
                .modoAltoContraste(entity.getModoAltoContraste())
                .modoEscuro(entity.getModoEscuro())
                .habilitarSom(entity.getHabilitarSom())
                .velocidadeVoz(entity.getVelocidadeVoz())
                .idiomaVoz(entity.getIdiomaVoz())
                .modoVarredura(entity.getModoVarredura())
                .tempoVarredura(entity.getTempoVarredura())
                .confirmarSelecao(entity.getConfirmarSelecao())
                .salvarHistorico(entity.getSalvarHistorico())
                .permitirRelatorios(entity.getPermitirRelatorios())
                .atualizadoEm(entity.getAtualizadoEm())
                .build();
    }

    public ConfiguracaoUsuario toEntity(ConfiguracaoUsuarioDTO dto) {
        if (dto == null) {
            return null;
        }

        return ConfiguracaoUsuario.builder()
                .id(dto.getId())
                .tamanhoPictograma(dto.getTamanhoPictograma())
                .modoAltoContraste(dto.getModoAltoContraste())
                .modoEscuro(dto.getModoEscuro())
                .habilitarSom(dto.getHabilitarSom())
                .velocidadeVoz(dto.getVelocidadeVoz())
                .idiomaVoz(dto.getIdiomaVoz())
                .modoVarredura(dto.getModoVarredura())
                .tempoVarredura(dto.getTempoVarredura())
                .confirmarSelecao(dto.getConfirmarSelecao())
                .salvarHistorico(dto.getSalvarHistorico())
                .permitirRelatorios(dto.getPermitirRelatorios())
                .build();
    }
}