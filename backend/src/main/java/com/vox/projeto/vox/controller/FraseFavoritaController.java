package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.FraseFavoritaDTO;
import com.vox.projeto.vox.service.FraseFavoritaService;
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
@RequestMapping("/api/frases-favoritas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Frases Favoritas", description = "Gerenciamento de frases prontas favoritas")
@CrossOrigin(origins = "*")
public class FraseFavoritaController {

    private final FraseFavoritaService fraseFavoritaService;

    @PostMapping
    @Operation(summary = "Criar frase favorita", description = "Cria uma nova frase pronta")
    public ResponseEntity<FraseFavoritaDTO> criarFraseFavorita(
            @Valid @RequestBody FraseFavoritaDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/frases-favoritas - Criando frase favorita");
        FraseFavoritaDTO criada = fraseFavoritaService.criarFraseFavorita(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @GetMapping
    @Operation(summary = "Listar frases favoritas", description = "Lista todas as frases favoritas ativas")
    public ResponseEntity<List<FraseFavoritaDTO>> listarFrasesFavoritas(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/frases-favoritas - Listando frases favoritas");
        List<FraseFavoritaDTO> frases = fraseFavoritaService.listarFrasesFavoritas(usuarioId);
        return ResponseEntity.ok(frases);
    }

    @GetMapping("/mais-usadas")
    @Operation(summary = "Listar mais usadas", description = "Lista frases favoritas ordenadas por uso")
    public ResponseEntity<List<FraseFavoritaDTO>> listarMaisUsadas(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/frases-favoritas/mais-usadas");
        List<FraseFavoritaDTO> frases = fraseFavoritaService.listarMaisUsadas(usuarioId);
        return ResponseEntity.ok(frases);
    }

    @PutMapping("/{fraseId}")
    @Operation(summary = "Atualizar frase favorita", description = "Atualiza uma frase favorita")
    public ResponseEntity<FraseFavoritaDTO> atualizarFraseFavorita(
            @PathVariable Long fraseId,
            @Valid @RequestBody FraseFavoritaDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/frases-favoritas/{}", fraseId);
        FraseFavoritaDTO atualizada = fraseFavoritaService.atualizarFraseFavorita(fraseId, dto, usuarioId);
        return ResponseEntity.ok(atualizada);
    }

    @PostMapping("/{fraseId}/usar")
    @Operation(summary = "Registrar uso", description = "Incrementa contador de uso da frase")
    public ResponseEntity<Void> registrarUso(
            @PathVariable Long fraseId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/frases-favoritas/{}/usar", fraseId);
        fraseFavoritaService.registrarUso(fraseId, usuarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{fraseId}")
    @Operation(summary = "Desativar frase favorita", description = "Desativa uma frase favorita")
    public ResponseEntity<Void> desativarFraseFavorita(
            @PathVariable Long fraseId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("DELETE /api/frases-favoritas/{}", fraseId);
        fraseFavoritaService.desativarFraseFavorita(fraseId, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reordenar")
    @Operation(summary = "Reordenar frases", description = "Define nova ordem das frases favoritas")
    public ResponseEntity<Void> reordenarFrases(
            @RequestBody List<Long> fraseIds,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/frases-favoritas/reordenar");
        fraseFavoritaService.reordenarFrases(fraseIds, usuarioId);
        return ResponseEntity.ok().build();
    }
}