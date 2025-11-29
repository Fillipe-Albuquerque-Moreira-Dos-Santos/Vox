package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.dto.ApiStatusResponse;
import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.dto.PictogramaExternoDTO;
import com.vox.projeto.vox.dto.PictogramaImportRequest;
import com.vox.projeto.vox.service.ArasaacApiService;
import com.vox.projeto.vox.service.PictogramaImportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para buscar e importar pictogramas da API ARASAAC
 */
@RestController
@RequestMapping("/api/pictogramas-externos")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Pictogramas Externos", description = "Busca e importação de pictogramas da API ARASAAC")
@CrossOrigin(origins = "*")
public class PictogramaExternoController {

    private final ArasaacApiService arasaacService;
    private final PictogramaImportService importService;

    /**
     * Busca pictogramas no ARASAAC por palavra-chave
     */
    @GetMapping("/buscar")
    @Operation(
            summary = "Buscar pictogramas",
            description = "Busca pictogramas na API ARASAAC por palavra-chave em português",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Busca realizada com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Parâmetros inválidos")
            }
    )
    public ResponseEntity<List<PictogramaExternoDTO>> buscarPictogramas(
            @Parameter(description = "Palavra-chave para busca", required = true)
            @RequestParam String palavra,

            @Parameter(description = "Limite de resultados (1-50)", example = "20")
            @RequestParam(defaultValue = "20")
            @Min(1) @Max(50)
            int limite,

            @Parameter(description = "ID do usuário", required = true)
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/pictogramas-externos/buscar?palavra={}&limite={} (usuário: {})",
                palavra, limite, usuarioId);

        List<PictogramaExternoDTO> pictogramas = arasaacService.buscarPorPalavra(palavra, limite);
        pictogramas = importService.marcarImportados(pictogramas, usuarioId);

        log.info("✅ Retornando {} pictogramas para '{}'", pictogramas.size(), palavra);
        return ResponseEntity.ok(pictogramas);
    }

    /**
     * Busca pictogramas por categoria
     */
    @GetMapping("/categoria/{nomeCategoria}")
    @Operation(
            summary = "Buscar por categoria",
            description = "Busca pictogramas relacionados a uma categoria específica (emoções, comida, lugares, etc)"
    )
    public ResponseEntity<List<PictogramaExternoDTO>> buscarPorCategoria(
            @PathVariable String nomeCategoria,

            @RequestParam(defaultValue = "30")
            @Min(1) @Max(50)
            int limite,

            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/pictogramas-externos/categoria/{} (usuário: {})", nomeCategoria, usuarioId);

        List<PictogramaExternoDTO> pictogramas = arasaacService.buscarPorCategoria(nomeCategoria, limite);
        pictogramas = importService.marcarImportados(pictogramas, usuarioId);

        log.info("✅ Retornando {} pictogramas da categoria '{}'", pictogramas.size(), nomeCategoria);
        return ResponseEntity.ok(pictogramas);
    }

    /**
     * Busca um pictograma específico por ID externo
     */
    @GetMapping("/{idExterno}")
    @Operation(
            summary = "Buscar por ID",
            description = "Busca um pictograma específico pelo ID do ARASAAC"
    )
    public ResponseEntity<PictogramaExternoDTO> buscarPorId(
            @PathVariable Long idExterno,
            @RequestHeader(value = "Usuario-Id", required = false) Long usuarioId) {

        log.info("GET /api/pictogramas-externos/{}", idExterno);

        PictogramaExternoDTO pictograma = arasaacService.buscarPorId(idExterno);

        if (pictograma == null) {
            log.warn("⚠️ Pictograma {} não encontrado", idExterno);
            return ResponseEntity.notFound().build();
        }

        // Marca se foi importado (opcional)
        if (usuarioId != null) {
            var lista = importService.marcarImportados(List.of(pictograma), usuarioId);
            pictograma = lista.getFirst();
        }

        return ResponseEntity.ok(pictograma);
    }

    /**
     * Importa um pictograma externo para o sistema VOX
     */
    @PostMapping("/importar")
    @Operation(
            summary = "Importar pictograma",
            description = "Importa um pictograma do ARASAAC para o sistema VOX"
    )
    public ResponseEntity<PictogramaDTO> importarPictograma(
            @Valid @RequestBody PictogramaImportRequest request,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/pictogramas-externos/importar - idExterno: {}, categoria: {}, colorido: {}",
                request.getIdExterno(), request.getCategoriaId(), request.isColorido());

        PictogramaDTO importado = importService.importarPictograma(
                request.getIdExterno(),
                request.getCategoriaId(),
                usuarioId,
                request.isColorido()
        );

        log.info("✅ Pictograma {} importado com sucesso (VOX ID: {})",
                request.getIdExterno(), importado.getId());

        return ResponseEntity.ok(importado);
    }

    /**
     * Importa múltiplos pictogramas de uma vez
     */
    @PostMapping("/importar-lote")
    @Operation(
            summary = "Importar múltiplos pictogramas",
            description = "Importa vários pictogramas de uma vez para uma ou mais categorias"
    )
    public ResponseEntity<ImportLoteResponse> importarLote(
            @Valid @RequestBody List<PictogramaImportRequest> requests,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("POST /api/pictogramas-externos/importar-lote - {} pictogramas (usuário: {})",
                requests.size(), usuarioId);

        List<PictogramaDTO> importados = importService.importarLote(requests, usuarioId);

        ImportLoteResponse response = ImportLoteResponse.builder()
                .totalSolicitado(requests.size())
                .totalImportado(importados.size())
                .totalFalhas(requests.size() - importados.size())
                .pictogramas(importados)
                .build();

        log.info("✅ Lote processado: {}/{} pictogramas importados com sucesso",
                importados.size(), requests.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Busca sugestões de pictogramas baseado em uma frase
     */
    @GetMapping("/sugerir")
    @Operation(
            summary = "Sugerir pictogramas",
            description = "Sugere pictogramas relevantes baseado em uma frase ou texto"
    )
    public ResponseEntity<List<PictogramaExternoDTO>> sugerirPictogramas(
            @RequestParam String texto,

            @RequestParam(defaultValue = "15")
            @Min(1) @Max(30)
            int limite,

            @RequestHeader("Usuario-Id") Long usuarioId) {

        log.info("GET /api/pictogramas-externos/sugerir?texto='{}' (usuário: {})", texto, usuarioId);

        List<PictogramaExternoDTO> sugestoes = importService.sugerirPictogramasParaTexto(texto, limite);
        sugestoes = importService.marcarImportados(sugestoes, usuarioId);

        log.info("✅ Retornando {} sugestões para '{}'", sugestoes.size(), texto);
        return ResponseEntity.ok(sugestoes);
    }

    /**
     * Verifica status da API ARASAAC
     */
    @GetMapping("/status")
    @Operation(
            summary = "Status da API",
            description = "Verifica se a API do ARASAAC está disponível"
    )
    public ResponseEntity<ApiStatusResponse> verificarStatus() {
        log.info("GET /api/pictogramas-externos/status");

        boolean disponivel = arasaacService.isApiDisponivel();

        ApiStatusResponse response = ApiStatusResponse.builder()
                .disponivel(disponivel)
                .fonte("ARASAAC")
                .mensagem(disponivel ?
                        "✅ API ARASAAC disponível e funcionando" :
                        "⚠️ API ARASAAC temporariamente indisponível")
                .build();

        log.info("Status ARASAAC: {}", disponivel ? "DISPONÍVEL" : "INDISPONÍVEL");
        return ResponseEntity.ok(response);
    }