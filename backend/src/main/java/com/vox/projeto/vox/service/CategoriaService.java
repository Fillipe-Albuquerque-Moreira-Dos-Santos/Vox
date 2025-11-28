package com.vox.projeto.vox.service;

import com.vox.projeto.vox.dto.CategoriaComPictogramasDTO;
import com.vox.projeto.vox.dto.CategoriaDTO;
import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.entity.Categoria;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.exception.ResourceNotFoundException;
import com.vox.projeto.vox.exception.BusinessException;
import com.vox.projeto.vox.mapper.CategoriaMapper;
import com.vox.projeto.vox.mapper.PictogramaMapper;
import com.vox.projeto.vox.repository.CategoriaRepository;
import com.vox.projeto.vox.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaMapper categoriaMapper;
    private final PictogramaMapper pictogramaMapper;

    /**
     * Criar nova categoria personalizada para o usuário
     */
    public CategoriaDTO criar(CategoriaDTO dto, Long usuarioId) {
        log.info("Criando categoria '{}' para usuário ID: {}", dto.getNome(), usuarioId);

        Usuario usuario = buscarUsuario(usuarioId);

        if (categoriaRepository.existsByNomeAndUsuario(dto.getNome(), usuario)) {
            throw new BusinessException("Já existe uma categoria com o nome '" + dto.getNome() + "'");
        }

        Categoria categoria = categoriaMapper.toEntity(dto);
        categoria.setUsuario(usuario);
        categoria.setPadrao(false);

        // ordem automática
        if (categoria.getOrdem() == null || categoria.getOrdem() == 0) {
            categoria.setOrdem((int) categoriaRepository.countByUsuarioAndAtivaTrue(usuario) + 1);
        }

        categoria = categoriaRepository.save(categoria);

        log.info("Categoria criada com sucesso. ID: {}", categoria.getId());
        return categoriaMapper.toDTO(categoria);
    }

    /**
     * Buscar todas categorias disponíveis para o usuário (padrão + personalizadas)
     */
    @Transactional(readOnly = true)
    public List<CategoriaDTO> buscarCategoriasDisponiveis(Long usuarioId) {
        log.info("Buscando categorias disponíveis para usuário ID: {}", usuarioId);

        Usuario usuario = buscarUsuario(usuarioId);

        return categoriaRepository.findCategoriasDisponiveisParaUsuario(usuario)
                .stream()
                .map(categoriaMapper::toDTO)
                .toList(); // Java 25
    }

    /**
     * Buscar categoria com seus pictogramas
     */
    @Transactional(readOnly = true)
    public CategoriaComPictogramasDTO buscarComPictogramas(Long categoriaId, Long usuarioId) {
        log.info("Buscando categoria ID: {} com pictogramas para usuário ID: {}", categoriaId, usuarioId);

        Usuario usuario = buscarUsuario(usuarioId);
        Categoria categoria = buscarCategoria(categoriaId);

        if (!categoria.getPadrao() && !categoria.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não tem permissão para acessar esta categoria");
        }

        CategoriaComPictogramasDTO dto = new CategoriaComPictogramasDTO(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getCor(),
                categoria.getIcone(),
                categoria.getAtiva(),
                categoria.getOrdem(),
                categoria.getPictogramas()
                        .stream()
                        .filter(p -> p.getAtivo())
                        .map(pictogramaMapper::toDTO)
                        .toList()
        );

        return dto;
    }

    /**
     * Atualizar categoria
     */
    public CategoriaDTO atualizar(Long id, CategoriaDTO dto, Long usuarioId) {
        log.info("Atualizando categoria ID: {} para usuário ID: {}", id, usuarioId);

        Usuario usuario = buscarUsuario(usuarioId);
        Categoria categoria = buscarCategoria(id);

        if (categoria.getPadrao()) {
            throw new BusinessException("Categorias padrão do sistema não podem ser editadas");
        }

        if (!categoria.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não tem permissão para editar esta categoria");
        }

        if (!categoria.getNome().equals(dto.getNome()) &&
                categoriaRepository.existsByNomeAndUsuario(dto.getNome(), usuario)) {
            throw new BusinessException("Já existe uma categoria com o nome '" + dto.getNome() + "'");
        }

        categoria.setNome(dto.getNome());
        categoria.setDescricao(dto.getDescricao());
        categoria.setCor(dto.getCor());
        categoria.setIcone(dto.getIcone());
        categoria.setOrdem(dto.getOrdem());

        categoria = categoriaRepository.save(categoria);

        log.info("Categoria atualizada com sucesso. ID: {}", categoria.getId());
        return categoriaMapper.toDTO(categoria);
    }

    /**
     * Desativar categoria (soft delete)
     */
    public void desativar(Long id, Long usuarioId) {
        log.info("Desativando categoria ID: {} para usuário ID: {}", id, usuarioId);

        Categoria categoria = buscarCategoria(id);

        if (categoria.getPadrao()) {
            throw new BusinessException("Categorias padrão do sistema não podem ser desativadas");
        }

        if (!categoria.getUsuario().getId().equals(usuarioId)) {
            throw new BusinessException("Você não tem permissão para desativar esta categoria");
        }

        categoria.setAtiva(false);
        categoriaRepository.save(categoria);

        log.info("Categoria desativada com sucesso. ID: {}", categoria.getId());
    }

    /**
     * Reordenar categorias do usuário (SEM FOR — 100% STREAM)
     */
    public void reordenar(List<Long> ordensIds, Long usuarioId) {
        log.info("Reordenando categorias para usuário ID: {}", usuarioId);

        Usuario usuario = buscarUsuario(usuarioId);

        ordensIds.stream()
                .map(id -> categoriaRepository.findByIdAndUsuario(id, usuario))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .forEach(categoria -> {
                    int novaOrdem = ordensIds.indexOf(categoria.getId()) + 1;
                    categoria.setOrdem(novaOrdem);
                    categoriaRepository.save(categoria);
                });

        log.info("Categorias reordenadas com sucesso");
    }

    // Métodos auxiliares (modernos + enxutos)
    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private Categoria buscarCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }
}
