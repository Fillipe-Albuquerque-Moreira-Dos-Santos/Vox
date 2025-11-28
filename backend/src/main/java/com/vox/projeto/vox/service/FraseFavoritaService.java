package com.vox.projeto.vox.service;

import com.vox.projeto.vox.dto.FraseFavoritaDTO;
import com.vox.projeto.vox.entity.FraseFavorita;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.exception.BusinessException;
import com.vox.projeto.vox.exception.ResourceNotFoundException;
import com.vox.projeto.vox.mapper.FraseFavoritaMapper;
import com.vox.projeto.vox.repository.FraseFavoritaRepository;
import com.vox.projeto.vox.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FraseFavoritaService {

    private final FraseFavoritaRepository fraseFavoritaRepository;
    private final UsuarioRepository usuarioRepository;
    private final FraseFavoritaMapper fraseFavoritaMapper;

    /**
     * Criar nova frase favorita
     */
    public FraseFavoritaDTO criarFraseFavorita(FraseFavoritaDTO dto, Long usuarioId) {
        log.info("Criando frase favorita para usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);

        // Validar se já existe frase com mesmo título
        if (fraseFavoritaRepository.existsByTituloAndUsuario(dto.getTitulo(), usuario)) {
            throw new BusinessException("Já existe uma frase favorita com este título");
        }

        FraseFavorita frase = FraseFavorita.builder()
                .titulo(dto.getTitulo())
                .conteudoJson(dto.getConteudoJson())
                .textoCompleto(dto.getTextoCompleto())
                .ativa(true)
                .ordem(dto.getOrdem() != null ? dto.getOrdem() : 0)
                .vezesUsada(0)
                .usuario(usuario)
                .build();

        FraseFavorita salva = fraseFavoritaRepository.save(frase);
        log.info("Frase favorita criada com sucesso: {}", salva.getId());

        return fraseFavoritaMapper.toDTO(salva);
    }

    /**
     * Listar frases favoritas do usuário
     */
    @Transactional(readOnly = true)
    public List<FraseFavoritaDTO> listarFrasesFavoritas(Long usuarioId) {
        log.info("Listando frases favoritas do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        List<FraseFavorita> frases = fraseFavoritaRepository
                .findByUsuarioAndAtivaOrderByOrdemAsc(usuario, true);

        return frases.stream()
                .map(fraseFavoritaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar frases mais usadas
     */
    @Transactional(readOnly = true)
    public List<FraseFavoritaDTO> listarMaisUsadas(Long usuarioId) {
        log.info("Listando frases mais usadas do usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        List<FraseFavorita> frases = fraseFavoritaRepository.findMaisUsadas(usuario);

        return frases.stream()
                .map(fraseFavoritaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualizar frase favorita
     */
    public FraseFavoritaDTO atualizarFraseFavorita(Long fraseId, FraseFavoritaDTO dto, Long usuarioId) {
        log.info("Atualizando frase favorita: {}", fraseId);

        FraseFavorita frase = buscarFrasePorId(fraseId);

        if (!frase.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não pode editar esta frase");
        }

        frase.setTitulo(dto.getTitulo());
        frase.setConteudoJson(dto.getConteudoJson());
        frase.setTextoCompleto(dto.getTextoCompleto());
        frase.setOrdem(dto.getOrdem());

        FraseFavorita atualizada = fraseFavoritaRepository.save(frase);
        log.info("Frase favorita atualizada com sucesso: {}", atualizada.getId());

        return fraseFavoritaMapper.toDTO(atualizada);
    }

    /**
     * Registrar uso da frase
     */
    public void registrarUso(Long fraseId, Long usuarioId) {
        log.debug("Registrando uso da frase favorita: {}", fraseId);

        FraseFavorita frase = buscarFrasePorId(fraseId);

        if (!frase.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não pode usar esta frase");
        }

        frase.incrementarUso();
        fraseFavoritaRepository.save(frase);
    }

    /**
     * Desativar frase favorita
     */
    public void desativarFraseFavorita(Long fraseId, Long usuarioId) {
        log.info("Desativando frase favorita: {}", fraseId);

        FraseFavorita frase = buscarFrasePorId(fraseId);

        if (!frase.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não pode desativar esta frase");
        }

        frase.setAtiva(false);
        fraseFavoritaRepository.save(frase);

        log.info("Frase favorita desativada com sucesso: {}", fraseId);
    }

    /**
     * Reordenar frases favoritas
     */
    public void reordenarFrases(List<Long> fraseIds, Long usuarioId) {
        log.info("Reordenando frases favoritas para usuário: {}", usuarioId);

        for (int i = 0; i < fraseIds.size(); i++) {
            Long fraseId = fraseIds.get(i);
            FraseFavorita frase = buscarFrasePorId(fraseId);

            if (frase.getUsuario().getId().equals(usuarioId)) {
                frase.setOrdem(i);
                fraseFavoritaRepository.save(frase);
            }
        }

        log.info("Frases favoritas reordenadas com sucesso");
    }

    // Métodos auxiliares
    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private FraseFavorita buscarFrasePorId(Long id) {
        return fraseFavoritaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Frase favorita não encontrada"));
    }
}