package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.CategoriaComPictogramasDTO;
import com.vox.projeto.vox.dto.CategoriaDTO;
import com.vox.projeto.vox.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Categorias", description = "Gerenciamento de categorias de pictogramas")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    @Operation(summary = "Criar nova categoria", description = "Cria uma categoria personalizada para o usuário")
    public ResponseEntity<CategoriaDTO> criarCategoria(
            @Valid @RequestBody CategoriaDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/categorias - Criando categoria para usuário: {}", usuarioId);
        CategoriaDTO criada = categoriaService.criarCategoria(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @GetMapping
    @Operation(summary = "Listar categorias disponíveis", description = "Lista todas as categorias (padrão + personalizadas)")
    public ResponseEntity<List<CategoriaDTO>> listarCategorias(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/categorias - Listando categorias para usuário: {}", usuarioId);
        List<CategoriaDTO> categorias = categoriaService.listarCategoriasDisponiveis(usuarioId);
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{categoriaId}")
    @Operation(summary = "Buscar categoria com pictogramas", description = "Retorna categoria completa com todos os pictogramas")
    public ResponseEntity<CategoriaComPictogramasDTO> buscarCategoriaComPictogramas(
            @PathVariable Long categoriaId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/categorias/{} - Buscando categoria com pictogramas", categoriaId);
        CategoriaComPictogramasDTO categoria = categoriaService.buscarCategoriaComPictogramas(categoriaId, usuarioId);
        return ResponseEntity.ok(categoria);
    }

    @PutMapping("/{categoriaId}")
    @Operation(summary = "Atualizar categoria", description = "Atualiza uma categoria personalizada")
    public ResponseEntity<CategoriaDTO> atualizarCategoria(
            @PathVariable Long categoriaId,
            @Valid @RequestBody CategoriaDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/categorias/{} - Atualizando categoria", categoriaId);
        CategoriaDTO atualizada = categoriaService.atualizarCategoria(categoriaId, dto, usuarioId);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{categoriaId}")
    @Operation(summary = "Desativar categoria", description = "Desativa uma categoria personalizada (soft delete)")
    public ResponseEntity<Void> desativarCategoria(
            @PathVariable Long categoriaId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("DELETE /api/categorias/{} - Desativando categoria", categoriaId);
        categoriaService.desativarCategoria(categoriaId, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reordenar")
    @Operation(summary = "Reordenar categorias", description = "Define nova ordem das categorias")
    public ResponseEntity<Void> reordenarCategorias(
            @RequestBody List<Long> categoriaIds,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/categorias/reordenar - Reordenando categorias");
        categoriaService.reordenarCategorias(categoriaIds, usuarioId);
        return ResponseEntity.ok().build();
    }
}