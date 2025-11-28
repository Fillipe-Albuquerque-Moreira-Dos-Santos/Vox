package com.vox.projeto.vox.service;

import com.vox.projeto.vox.dto.EstatisticasDTO;
import com.vox.projeto.vox.dto.MensagemCreateDTO;
import com.vox.projeto.vox.dto.MensagemDTO;
import com.vox.projeto.vox.entity.Mensagem;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.exception.ResourceNotFoundException;
import com.vox.projeto.vox.mapper.MensagemMapper;
import com.vox.projeto.vox.repository.MensagemRepository;
import com.vox.projeto.vox.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final MensagemMapper mensagemMapper;

    /**
     * Salvar nova mensagem
     */
    public MensagemDTO salvarMensagem(MensagemCreateDTO dto, Long usuarioId) {
        log.info("Salvando mensagem para usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        Mensagem mensagem = Mensagem.builder()
                .conteudoJson(dto.getConteudoJson())
                .textoCompleto(dto.getTextoCompleto())
                .contexto(dto.getContexto())
                .dispositivoOrigem(dto.getDispositivoOrigem())
                .usuario(usuario)
                .favorita(false)
                .vezesReutilizada(0)
                .build();

        Mensagem salva = mensagemRepository.save(mensagem);
        log.info("Mensagem salva com sucesso: {}", salva.getId());

        return mensagemMapper.toDTO(salva);
    }

    /**
     * Listar mensagens do usuário (paginado)
     */
    @Transactional(readOnly = true)
    public Page<MensagemDTO> listarMensagens(Long usuarioId, Pageable pageable) {
        log.info("Listando mensagens do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        Page<Mensagem> mensagens = mensagemRepository.findByUsuarioOrderByCriadoEmDesc(usuario, pageable);

        return mensagens.map(mensagemMapper::toDTO);
    }

    /**
     * Listar mensagens favoritas
     */
    @Transactional(readOnly = true)
    public List<MensagemDTO> listarFavoritas(Long usuarioId) {
        log.info("Listando mensagens favoritas do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        List<Mensagem> mensagens = mensagemRepository.findByUsuarioAndFavoritaTrueOrderByCriadoEmDesc(usuario);

        return mensagens.stream()
                .map(mensagemMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar mensagens por período
     */
    @Transactional(readOnly = true)
    public List<MensagemDTO> listarPorPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        log.info("Listando mensagens do período {} a {} para usuário: {}", inicio, fim, usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        List<Mensagem> mensagens = mensagemRepository
                .findByUsuarioAndCriadoEmBetweenOrderByCriadoEmDesc(usuario, inicio, fim);

        return mensagens.stream()
                .map(mensagemMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Alternar favorito
     */
    public MensagemDTO toggleFavorita(Long mensagemId, Long usuarioId) {
        log.info("Alternando favorito da mensagem: {}", mensagemId);

        Mensagem mensagem = buscarMensagemPorId(mensagemId);

        if (!mensagem.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Mensagem não encontrada");
        }

        mensagem.toggleFavorita();
        Mensagem atualizada = mensagemRepository.save(mensagem);

        log.info("Favorito alternado: {}", atualizada.getFavorita());
        return mensagemMapper.toDTO(atualizada);
    }

    /**
     * Reutilizar mensagem
     */
    public void reutilizarMensagem(Long mensagemId, Long usuarioId) {
        log.info("Reutilizando mensagem: {}", mensagemId);

        Mensagem mensagem = buscarMensagemPorId(mensagemId);

        if (!mensagem.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Mensagem não encontrada");
        }

        mensagem.reutilizar();
        mensagemRepository.save(mensagem);

        log.info("Mensagem reutilizada: {} vezes", mensagem.getVezesReutilizada());
    }

    /**
     * Obter estatísticas de uso
     */
    @Transactional(readOnly = true)
    public EstatisticasDTO obterEstatisticas(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        log.info("Obtendo estatísticas do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        long totalMensagens = mensagemRepository.countByUsuario(usuario);
        long mensagensPeriodo = mensagemRepository.countByUsuarioAndCriadoEmBetween(usuario, inicio, fim);

        return EstatisticasDTO.builder()
                .totalMensagens(totalMensagens)
                .mensagensNoPeriodo(mensagensPeriodo)
                .build();
    }

    // Métodos auxiliares
    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private Mensagem buscarMensagemPorId(Long id) {
        return mensagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem não encontrada"));
    }
}