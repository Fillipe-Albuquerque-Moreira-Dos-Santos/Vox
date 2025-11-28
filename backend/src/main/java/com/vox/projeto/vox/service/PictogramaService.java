package com.vox.projeto.vox.service;

import com.vox.projeto.vox.dto.PictogramaCreateDTO;
import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.entity.Categoria;
import com.vox.projeto.vox.entity.Pictograma;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.exception.BusinessException;
import com.vox.projeto.vox.exception.ResourceNotFoundException;
import com.vox.projeto.vox.mapper.PictogramaMapper;
import com.vox.projeto.vox.repository.CategoriaRepository;
import com.vox.projeto.vox.repository.PictogramaRepository;
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
public class PictogramaService {

    private final PictogramaRepository pictogramaRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PictogramaMapper pictogramaMapper;

    /**
     * Criar novo pictograma personalizado
     */
    public PictogramaDTO criarPictograma(PictogramaCreateDTO dto, Long usuarioId) {
        log.info("Criando pictograma para usuário: {}", usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        Categoria categoria = buscarCategoriaPorId(dto.getCategoriaId());

        // Validar se já existe pictograma com mesmo label na categoria
        if (pictogramaRepository.existsByLabelAndCategoriaAndUsuario(dto.getLabel(), categoria, usuario)) {
            throw new BusinessException("Já existe um pictograma com este nome nesta categoria");
        }

        Pictograma pictograma = Pictograma.builder()
                .label(dto.getLabel())
                .labelAlternativo(dto.getLabelAlternativo())
                .cor(dto.getCor())
                .icone(dto.getIcone())
                .imagemUrl(dto.getImagemUrl())
                .tipo(dto.getTipo())
                .ordem(dto.getOrdem() != null ? dto.getOrdem() : 0)
                .ativo(true)
                .padrao(false)
                .vezesUsado(0)
                .categoria(categoria)
                .usuario(usuario)
                .build();

        Pictograma salvo = pictogramaRepository.save(pictograma);
        log.info("Pictograma criado com sucesso: {}", salvo.getId());

        return pictogramaMapper.toDTO(salvo);
    }

    /**
     * Buscar pictogramas por categoria
     */
    @Transactional(readOnly = true)
    public List<PictogramaDTO> listarPorCategoria(Long categoriaId, Long usuarioId) {
        log.info("Listando pictogramas da categoria {} para usuário: {}", categoriaId, usuarioId);

        Categoria categoria = buscarCategoriaPorId(categoriaId);
        Usuario usuario = buscarUsuarioPorId(usuarioId);

        List<Pictograma> pictogramas = pictogramaRepository
                .findPictogramasDisponiveisParaUsuario(usuario, categoria);

        return pictogramas.stream()
                .map(pictogramaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Buscar pictogramas mais usados
     */
    @Transactional(readOnly = true)
    public List<PictogramaDTO> listarMaisUsados(Long usuarioId, int limite) {
        log.info("Listando {} pictogramas mais usados do usuário: {}", limite, usuarioId);

        Usuario usuario = buscarUsuarioPorId(usuarioId);
        List<Pictograma> pictogramas = pictogramaRepository.findMaisUsadosPorUsuario(usuario);

        return pictogramas.stream()
                .limit(limite)
                .map(pictogramaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Buscar pictogramas por texto
     */
    @Transactional(readOnly = true)
    public List<PictogramaDTO> buscarPorTexto(String termo) {
        log.info("Buscando pictogramas com termo: {}", termo);

        List<Pictograma> pictogramas = pictogramaRepository.buscarPorLabelOuAlternativo(termo);

        return pictogramas.stream()
                .map(pictogramaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualizar pictograma
     */
    public PictogramaDTO atualizarPictograma(Long pictogramaId, PictogramaCreateDTO dto, Long usuarioId) {
        log.info("Atualizando pictograma: {}", pictogramaId);

        Pictograma pictograma = buscarPictogramaPorId(pictogramaId);

        // Validar se pictograma pode ser editado
        if (pictograma.getPadrao()) {
            throw new BusinessException("Pictogramas padrão não podem ser editados");
        }

        if (!pictograma.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não pode editar este pictograma");
        }

        // Atualizar campos
        pictograma.setLabel(dto.getLabel());
        pictograma.setLabelAlternativo(dto.getLabelAlternativo());
        pictograma.setCor(dto.getCor());
        pictograma.setIcone(dto.getIcone());
        pictograma.setImagemUrl(dto.getImagemUrl());
        pictograma.setTipo(dto.getTipo());
        pictograma.setOrdem(dto.getOrdem() != null ? dto.getOrdem() : pictograma.getOrdem());

        Pictograma atualizado = pictogramaRepository.save(pictograma);
        log.info("Pictograma atualizado com sucesso: {}", atualizado.getId());

        return pictogramaMapper.toDTO(atualizado);
    }

    /**
     * Registrar uso do pictograma
     */
    public void registrarUso(Long pictogramaId) {
        log.debug("Registrando uso do pictograma: {}", pictogramaId);

        Pictograma pictograma = buscarPictogramaPorId(pictogramaId);
        pictograma.incrementarUso();
        pictogramaRepository.save(pictograma);
    }

    /**
     * Desativar pictograma (soft delete)
     */
    public void desativarPictograma(Long pictogramaId, Long usuarioId) {
        log.info("Desativando pictograma: {}", pictogramaId);

        Pictograma pictograma = buscarPictogramaPorId(pictogramaId);

        if (pictograma.getPadrao()) {
            throw new BusinessException("Pictogramas padrão não podem ser desativados");
        }

        if (!pictograma.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não pode desativar este pictograma");
        }

        pictograma.setAtivo(false);
        pictogramaRepository.save(pictograma);

        log.info("Pictograma desativado com sucesso: {}", pictogramaId);
    }

    // Métodos auxiliares
    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private Categoria buscarCategoriaPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    private Pictograma buscarPictogramaPorId(Long id) {
        return pictogramaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pictograma não encontrado"));
    }
}