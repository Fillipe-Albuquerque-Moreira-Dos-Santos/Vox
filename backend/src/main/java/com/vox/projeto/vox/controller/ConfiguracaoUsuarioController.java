package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.ConfiguracaoUsuarioDTO;
import com.vox.projeto.vox.service.ConfiguracaoUsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracoes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Configurações", description = "Gerenciamento de preferências do usuário")
@CrossOrigin(origins = "*")
public class ConfiguracaoUsuarioController {

    private final ConfiguracaoUsuarioService configuracaoService;

    @GetMapping
    @Operation(summary = "Obter configurações", description = "Retorna configurações do usuário")
    public ResponseEntity<ConfiguracaoUsuarioDTO> obterConfiguracoes(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/configuracoes - Obtendo configurações do usuário: {}", usuarioId);
        ConfiguracaoUsuarioDTO config = configuracaoService.obterConfiguracoes(usuarioId);
        return ResponseEntity.ok(config);
    }

    @PutMapping
    @Operation(summary = "Atualizar configurações", description = "Atualiza preferências do usuário")
    public ResponseEntity<ConfiguracaoUsuarioDTO> atualizarConfiguracoes(
            @Valid @RequestBody ConfiguracaoUsuarioDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/configuracoes - Atualizando configurações");
        ConfiguracaoUsuarioDTO atualizada = configuracaoService.atualizarConfiguracoes(dto, usuarioId);
        return ResponseEntity.ok(atualizada);
    }

    @PostMapping("/resetar")
    @Operation(summary = "Resetar configurações", description = "Restaura configurações para valores padrão")
    public ResponseEntity<ConfiguracaoUsuarioDTO> resetarConfiguracoes(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/configuracoes/resetar - Resetando configurações");
        ConfiguracaoUsuarioDTO resetada = configuracaoService.resetarConfiguracoes(usuarioId);
        return ResponseEntity.ok(resetada);
    }
}