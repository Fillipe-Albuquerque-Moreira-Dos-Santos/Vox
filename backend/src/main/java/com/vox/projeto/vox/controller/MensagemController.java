package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.EstatisticasDTO;
import com.vox.projeto.vox.dto.MensagemCreateDTO;
import com.vox.projeto.vox.dto.MensagemDTO;
import com.vox.projeto.vox.service.MensagemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/mensagens")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Mensagens", description = "Gerenciamento de histórico de mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    private final MensagemService mensagemService;

    @PostMapping
    @Operation(summary = "Salvar mensagem", description = "Salva uma nova mensagem no histórico")
    public ResponseEntity<MensagemDTO> salvarMensagem(
            @Valid @RequestBody MensagemCreateDTO dto,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/mensagens - Salvando mensagem para usuário: {}", usuarioId);
        MensagemDTO salva = mensagemService.salvarMensagem(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping
    @Operation(summary = "Listar mensagens", description = "Lista mensagens do usuário com paginação")
    public ResponseEntity<Page<MensagemDTO>> listarMensagens(
            @RequestHeader("Usuario-Id") Long usuarioId,
            Pageable pageable) {

        log.info("GET /api/mensagens - Listando mensagens do usuário: {}", usuarioId);
        Page<MensagemDTO> mensagens = mensagemService.listarMensagens(usuarioId, pageable);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/favoritas")
    @Operation(summary = "Listar favoritas", description = "Lista todas as mensagens favoritas")
    public ResponseEntity<List<MensagemDTO>> listarFavoritas(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/mensagens/favoritas - Listando favoritas");
        List<MensagemDTO> favoritas = mensagemService.listarFavoritas(usuarioId);
        return ResponseEntity.ok(favoritas);
    }

    @GetMapping("/periodo")
    @Operation(summary = "Listar por período", description = "Lista mensagens de um período específico")
    public ResponseEntity<List<MensagemDTO>> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/mensagens/periodo - Listando de {} a {}", inicio, fim);
        List<MensagemDTO> mensagens = mensagemService.listarPorPeriodo(usuarioId, inicio, fim);
        return ResponseEntity.ok(mensagens);
    }

    @PutMapping("/{mensagemId}/favorita")
    @Operation(summary = "Alternar favorito", description = "Marca/desmarca mensagem como favorita")
    public ResponseEntity<MensagemDTO> toggleFavorita(
            @PathVariable Long mensagemId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("PUT /api/mensagens/{}/favorita - Alternando favorito", mensagemId);
        MensagemDTO atualizada = mensagemService.toggleFavorita(mensagemId, usuarioId);
        return ResponseEntity.ok(atualizada);
    }

    @PostMapping("/{mensagemId}/reutilizar")
    @Operation(summary = "Reutilizar mensagem", description = "Incrementa contador de reutilização")
    public ResponseEntity<Void> reutilizarMensagem(
            @PathVariable Long mensagemId,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/mensagens/{}/reutilizar", mensagemId);
        mensagemService.reutilizarMensagem(mensagemId, usuarioId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Obter estatísticas", description = "Retorna estatísticas de uso de mensagens")
    public ResponseEntity<EstatisticasDTO> obterEstatisticas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/mensagens/estatisticas - Obtendo estatísticas");
        EstatisticasDTO stats = mensagemService.obterEstatisticas(usuarioId, inicio, fim);
        return ResponseEntity.ok(stats);
    }
}