package com.vox.projeto.vox.service;

import com.vox.projeto.vox.dto.ConfiguracaoUsuarioDTO;
import com.vox.projeto.vox.entity.ConfiguracaoUsuario;
import com.vox.projeto.vox.entity.TamanhoPictograma;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.exception.ResourceNotFoundException;
import com.vox.projeto.vox.mapper.ConfiguracaoUsuarioMapper;
import com.vox.projeto.vox.repository.ConfiguracaoUsuarioRepository;
import com.vox.projeto.vox.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ConfiguracaoUsuarioService {

    private final ConfiguracaoUsuarioRepository configuracaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConfiguracaoUsuarioMapper configuracaoMapper;

    /**
     * Obter configurações do usuário (cria padrão se não existir)
     */
    @Transactional(readOnly = true)
    public ConfiguracaoUsuarioDTO obterConfiguracoes(Long usuarioId) {
        log.info("Obtendo configurações do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        ConfiguracaoUsuario config = configuracaoRepository.findByUsuario(usuario)
                .orElseGet(() -> criarConfiguracaoPadrao(usuario));

        return configuracaoMapper.toDTO(config);
    }

    /**
     * Atualizar configurações do usuário
     */
    public ConfiguracaoUsuarioDTO atualizarConfiguracoes(ConfiguracaoUsuarioDTO dto, Long usuarioId) {
        log.info("Atualizando configurações do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        ConfiguracaoUsuario config = configuracaoRepository.findByUsuario(usuario)
                .orElseGet(() -> criarConfiguracaoPadrao(usuario));

        // Atualizar todos os campos
        config.setTamanhoPictograma(dto.getTamanhoPictograma());
        config.setModoAltoContraste(dto.getModoAltoContraste());
        config.setModoEscuro(dto.getModoEscuro());
        config.setHabilitarSom(dto.getHabilitarSom());
        config.setVelocidadeVoz(dto.getVelocidadeVoz());
        config.setIdiomaVoz(dto.getIdiomaVoz());
        config.setModoVarredura(dto.getModoVarredura());
        config.setTempoVarredura(dto.getTempoVarredura());
        config.setConfirmarSelecao(dto.getConfirmarSelecao());
        config.setSalvarHistorico(dto.getSalvarHistorico());
        config.setPermitirRelatorios(dto.getPermitirRelatorios());

        ConfiguracaoUsuario atualizada = configuracaoRepository.save(config);
        log.info("Configurações atualizadas com sucesso para usuário: {}", usuarioId);

        return configuracaoMapper.toDTO(atualizada);
    }

    /**
     * Resetar configurações para padrão
     */
    public ConfiguracaoUsuarioDTO resetarConfiguracoes(Long usuarioId) {
        log.info("Resetando configurações do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        ConfiguracaoUsuario config = configuracaoRepository.findByUsuario(usuario)
                .orElseGet(() -> criarConfiguracaoPadrao(usuario));

        // Resetar para valores padrão
        config.setTamanhoPictograma(TamanhoPictograma.MEDIO);
        config.setModoAltoContraste(false);
        config.setModoEscuro(false);
        config.setHabilitarSom(true);
        config.setVelocidadeVoz(1);
        config.setIdiomaVoz("pt-BR");
        config.setModoVarredura(false);
        config.setTempoVarredura(3);
        config.setConfirmarSelecao(false);
        config.setSalvarHistorico(true);
        config.setPermitirRelatorios(true);

        ConfiguracaoUsuario resetada = configuracaoRepository.save(config);
        log.info("Configurações resetadas para usuário: {}", usuarioId);

        return configuracaoMapper.toDTO(resetada);
    }

    // Método auxiliar para criar configuração padrão
    private ConfiguracaoUsuario criarConfiguracaoPadrao(Usuario usuario) {
        log.info("Criando configuração padrão para usuário: {}", usuario.getId());

        ConfiguracaoUsuario config = ConfiguracaoUsuario.builder()
                .usuario(usuario)
                .tamanhoPictograma(TamanhoPictograma.MEDIO)
                .modoAltoContraste(false)
                .modoEscuro(false)
                .habilitarSom(true)
                .velocidadeVoz(1)
                .idiomaVoz("pt-BR")
                .modoVarredura(false)
                .tempoVarredura(3)
                .confirmarSelecao(false)
                .salvarHistorico(true)
                .permitirRelatorios(true)
                .build();

        return configuracaoRepository.save(config);
    }

    // Método auxiliar
    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }
}