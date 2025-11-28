package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.PictogramaCreateDTO;
import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.service.PictogramaService;
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
@RequestMapping("/api/pictogramas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Pictogramas", description = "Gerenciamento de pictogramas")
@CrossOrigin(origins = "*")
public class PictogramaController {

    private final PictogramaService pictogramaService;

    @PostMapping
    @Operation(summary = "Criar novo pictograma", description = "Cria um pictograma personalizado")
    public ResponseEntity<PictogramaDTO> criarPictograma(
            @Valid @RequestBody PictogramaCreateDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/pictogramas - Criando pictograma para usuário: {}", usuarioId);
        PictogramaDTO criado = pictogramaService.criarPictograma(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Listar por categoria", description = "Lista todos os pictogramas de uma categoria")
    public ResponseEntity<List<PictogramaDTO>> listarPorCategoria(
            @PathVariable Long categoriaId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/pictogramas/categoria/{} - Listando pictogramas", categoriaId);
        List<PictogramaDTO> pictogramas = pictogramaService.listarPorCategoria(categoriaId, usuarioId);
        return ResponseEntity.ok(pictogramas);
    }

    @GetMapping("/mais-usados")
    @Operation(summary = "Listar mais usados", description = "Retorna os pictogramas mais utilizados pelo usuário")
    public ResponseEntity<List<PictogramaDTO>> listarMaisUsados(
            @RequestParam(defaultValue = "10") int limite,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/pictogramas/mais-usados - Listando {} mais usados", limite);
        List<PictogramaDTO> pictogramas = pictogramaService.listarMaisUsados(usuarioId, limite);
        return ResponseEntity.ok(pictogramas);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar por texto", description = "Busca pictogramas por label ou alternativo")
    public ResponseEntity<List<PictogramaDTO>> buscarPorTexto(
            @RequestParam String termo) {

        log.info("GET /api/pictogramas/buscar?termo={}", termo);
        List<PictogramaDTO> pictogramas = pictogramaService.buscarPorTexto(termo);
        return ResponseEntity.ok(pictogramas);
    }

    @PutMapping("/{pictogramaId}")
    @Operation(summary = "Atualizar pictograma", description = "Atualiza um pictograma personalizado")
    public ResponseEntity<PictogramaDTO> atualizarPictograma(
            @PathVariable Long pictogramaId,
            @Valid @RequestBody PictogramaCreateDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/pictogramas/{} - Atualizando pictograma", pictogramaId);
        PictogramaDTO atualizado = pictogramaService.atualizarPictograma(pictogramaId, dto, usuarioId);
        return ResponseEntity.ok(atualizado);
    }

    @PostMapping("/{pictogramaId}/usar")
    @Operation(summary = "Registrar uso", description = "Incrementa contador de uso do pictograma")
    public ResponseEntity<Void> registrarUso(@PathVariable Long pictogramaId) {

        log.info("POST /api/pictogramas/{}/usar - Registrando uso", pictogramaId);
        pictogramaService.registrarUso(pictogramaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{pictogramaId}")
    @Operation(summary = "Desativar pictograma", description = "Desativa um pictograma personalizado")
    public ResponseEntity<Void> desativarPictograma(
            @PathVariable Long pictogramaId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("DELETE /api/pictogramas/{} - Desativando pictograma", pictogramaId);
        pictogramaService.desativarPictograma(pictogramaId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}