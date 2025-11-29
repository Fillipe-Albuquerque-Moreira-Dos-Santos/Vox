//package com.vox.projeto.vox.service;
//
//import com.vox.projeto.vox.dto.PictogramaExternoDTO;
//import com.vox.projeto.vox.dto.arasaac.ArasaacPictogramResponse;
//import com.vox.projeto.vox.mapper.ArasaacMapper;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.core.ParameterizedTypeReference;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;
//import org.springframework.web.util.UriComponentsBuilder;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
///**
// * Service para integração com API ARASAAC usando RestClient (Spring 6.1+)
// *
// * API ARASAAC: https://arasaac.org/developers/api
// * - 15.000+ pictogramas gratuitos
// * - Multilíngue (PT-BR suportado)
// * - Alta qualidade e uso livre
// */
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class ArasaacApiService {
//
//    private static final String ARASAAC_API_BASE = "https://api.arasaac.org/v1";
//    private static final String ARASAAC_IMAGE_BASE = "https://static.arasaac.org/pictograms";
//    private static final String DEFAULT_LANGUAGE = "pt";
//
//    private final RestClient restClient;
//    private final ArasaacMapper arasaacMapper;
//
//    /**
//     * Busca pictogramas por palavra-chave em português
//     */
//    @Cacheable(value = "arasaac-search", key = "#keyword + '-' + #limit")
//    public List<PictogramaExternoDTO> buscarPorPalavra(String keyword, int limit) {
//        log.info("🔍 Buscando pictogramas ARASAAC para: '{}'", keyword);
//
//        try {
//            String uri = UriComponentsBuilder
//                    .fromHttpUrl(ARASAAC_API_BASE)
//                    .pathSegment("pictograms", DEFAULT_LANGUAGE, "search", keyword)
//                    .toUriString();
//
//            List<ArasaacPictogramResponse> response = restClient.get()
//                    .uri(uri)
//                    .retrieve()
//                    .body(new ParameterizedTypeReference<>() {});
//
//            if (response == null || response.isEmpty()) {
//                log.warn("⚠️ Nenhum resultado encontrado para: '{}'", keyword);
//                return List.of();
//            }
//
//            List<PictogramaExternoDTO> pictogramas = response.stream()
//                    .limit(limit)
//                    .map(arasaacMapper::toExternoDTO)
//                    .toList();
//
//            log.info("✅ Encontrados {} pictogramas para '{}'", pictogramas.size(), keyword);
//            return pictogramas;
//
//        } catch (Exception e) {
//            log.error("❌ Erro ao buscar pictogramas: {}", e.getMessage(), e);
//            return List.of();
//        }
//    }
//
//    /**
//     * Busca um pictograma específico por ID
//     */
//    @Cacheable(value = "arasaac-pictogram", key = "#pictogramId")
//    public PictogramaExternoDTO buscarPorId(Long pictogramId) {
//        log.info("🔍 Buscando pictograma ARASAAC ID: {}", pictogramId);
//
//        try {
//            String uri = UriComponentsBuilder
//                    .fromHttpUrl(ARASAAC_API_BASE)
//                    .pathSegment("pictograms", DEFAULT_LANGUAGE, String.valueOf(pictogramId))
//                    .toUriString();
//
//            ArasaacPictogramResponse response = restClient.get()
//                    .uri(uri)
//                    .retrieve()
//                    .body(ArasaacPictogramResponse.class);
//
//            if (response == null) {
//                log.warn("⚠️ Pictograma {} não encontrado", pictogramId);
//                return null;
//            }
//
//            log.info("✅ Pictograma {} encontrado: {}", pictogramId, response.getKeywords().getFirst().getKeyword());
//            return arasaacMapper.toExternoDTO(response);
//
//        } catch (Exception e) {
//            log.error("❌ Erro ao buscar pictograma {}: {}", pictogramId, e.getMessage());
//            return null;
//        }
//    }
//
//    /**
//     * Busca múltiplas palavras-chave de uma vez
//     */
//    public List<PictogramaExternoDTO> buscarMultiplasPalavras(List<String> keywords, int limitPorPalavra) {
//        log.info("🔍 Buscando múltiplas palavras: {}", keywords);
//
//        return keywords.parallelStream()
//                .flatMap(keyword -> buscarPorPalavra(keyword, limitPorPalavra).stream())
//                .distinct()
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Busca pictogramas por categoria (mapeamento inteligente)
//     */
//    @Cacheable(value = "arasaac-category", key = "#categoria + '-' + #limit")
//    public List<PictogramaExternoDTO> buscarPorCategoria(String categoria, int limit) {
//        log.info("🔍 Buscando categoria: '{}'", categoria);
//
//        List<String> keywords = mapearCategoriaParaKeywords(categoria);
//        int limitePorKeyword = Math.max(1, limit / keywords.size());
//
//        return keywords.stream()
//                .flatMap(keyword -> buscarPorPalavra(keyword, limitePorKeyword).stream())
//                .distinct()
//                .limit(limit)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Gera URLs das imagens do pictograma
//     */
//    public String gerarUrlImagem(Long pictogramId, int size) {
//        return String.format("%s/%d/%d_%d.png", ARASAAC_IMAGE_BASE, pictogramId, pictogramId, size);
//    }
//
//    public String gerarUrlImagemColorida(Long pictogramId) {
//        return String.format("%s/%d/%d_300_color.png", ARASAAC_IMAGE_BASE, pictogramId, pictogramId);
//    }
//
//    public String gerarUrlImagemAlta(Long pictogramId) {
//        return String.format("%s/%d/%d_2500.png", ARASAAC_IMAGE_BASE, pictogramId, pictogramId);
//    }
//
//    /**
//     * Verifica disponibilidade da API
//     */
//    public boolean isApiDisponivel() {
//        try {
//            String uri = UriComponentsBuilder
//                    .fromHttpUrl(ARASAAC_API_BASE)
//                    .pathSegment("pictograms", DEFAULT_LANGUAGE, "bestsearch", "casa")
//                    .toUriString();
//
//            restClient.get()
//                    .uri(uri)
//                    .retrieve()
//                    .toBodilessEntity();
//
//            log.info("✅ API ARASAAC disponível");
//            return true;
//
//        } catch (Exception e) {
//            log.warn("⚠️ API ARASAAC indisponível: {}", e.getMessage());
//            return false;
//        }
//    }
//
//    // ===========================================
//    // MAPEAMENTO DE CATEGORIAS
//    // ===========================================
//
//    private List<String> mapearCategoriaParaKeywords(String categoria) {
//        return switch (categoria.toLowerCase()) {
//            case "emoções", "emocoes" ->
//                    List.of("feliz", "triste", "raiva", "medo", "amor", "surpresa", "nojo");
//
//            case "alimentação", "alimentacao", "comida" ->
//                    List.of("comida", "bebida", "frutas", "legumes", "pão", "leite", "água", "café");
//
//            case "lugares" ->
//                    List.of("casa", "escola", "hospital", "parque", "praia", "igreja", "mercado");
//
//            case "pessoas", "família", "familia" ->
//                    List.of("mãe", "pai", "irmão", "avó", "avô", "amigo", "bebê", "professor");
//
//            case "necessidades" ->
//                    List.of("banheiro", "dormir", "dor", "ajuda", "remédio", "banho", "sede", "fome");
//
//            case "ações", "acoes" ->
//                    List.of("quero", "brincar", "ver", "ouvir", "ler", "desenhar", "sair", "entrar");
//
//            case "animais" ->
//                    List.of("cachorro", "gato", "pássaro", "peixe", "cavalo", "vaca", "galinha");
//
//            case "cores" ->
//                    List.of("vermelho", "azul", "verde", "amarelo", "preto", "branco", "rosa");
//
//            case "números", "numeros" ->
//                    List.of("um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez");
//
//            case "transporte" ->
//                    List.of("carro", "ônibus", "bicicleta", "avião", "trem", "barco", "moto");
//
//            case "corpo" ->
//                    List.of("cabeça", "mão", "pé", "olho", "boca", "orelha", "nariz");
//
//            case "tempo" ->
//                    List.of("manhã", "tarde", "noite", "hoje", "amanhã", "ontem", "dia", "semana");
//
//            case "objetos", "brinquedos" ->
//                    List.of("bola", "boneca", "livro", "lápis", "telefone", "relógio");
//
//            default -> List.of(categoria);
//        };
//    }
//}