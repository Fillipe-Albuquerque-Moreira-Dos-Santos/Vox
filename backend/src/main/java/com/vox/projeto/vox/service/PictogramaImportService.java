package com.vox.projeto.vox.service;

import com.vox.projeto.vox.controller.PictogramaExternoController.PictogramaImportRequest;
import com.vox.projeto.vox.dto.PictogramaDTO;
import com.vox.projeto.vox.dto.PictogramaExternoDTO;
import com.vox.projeto.vox.entity.Categoria;
import com.vox.projeto.vox.entity.Pictograma;
import com.vox.projeto.vox.entity.TipoPictograma;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service para importar pictogramas de APIs externas para o sistema VOX
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PictogramaImportService {

    private final ArasaacApiService arasaacService;
    private final PictogramaRepository pictogramaRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PictogramaMapper pictogramaMapper;

    /**
     * Importa um único pictograma do ARASAAC
     */
    public PictogramaDTO importarPictograma(Long idExterno, Long categoriaId, Long usuarioId, boolean colorido) {
        log.info("📥 Importando pictograma ARASAAC {} para categoria {}", idExterno, categoriaId);

        // Busca dados do ARASAAC
        PictogramaExternoDTO externo = arasaacService.buscarPorId(idExterno);
        if (externo == null) {
            throw new ResourceNotFoundException("Pictograma não encontrado no ARASAAC: " + idExterno);
        }

        // Busca categoria e usuário
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // Verifica se já foi importado
        boolean jaExiste = pictogramaRepository.existsByLabelAndCategoriaAndUsuario(
                externo.getLabel(), categoria, usuario
        );

        if (jaExiste) {
            throw new BusinessException("Pictograma já foi importado nesta categoria");
        }

        // Cria o pictograma no sistema
        Pictograma pictograma = Pictograma.builder()
                .label(externo.getLabel())
                .labelAlternativo(externo.getLabelAlternativo())
                .cor(determinarCor(categoria))
                .icone(null) // Usa imagem ao invés de emoji
                .imagemUrl(colorido ? externo.getImagemUrlColorida() : externo.getImagemUrl())
                .tipo(TipoPictograma.IMAGEM)
                .ativo(true)
                .padrao(false)
                .ordem(obterProximaOrdem(categoria))
                .vezesUsado(0)
                .categoria(categoria)
                .usuario(usuario)
                .build();

        Pictograma salvo = pictogramaRepository.save(pictograma);
        log.info("✅ Pictograma importado com sucesso: {} (ID: {})", salvo.getLabel(), salvo.getId());

        return pictogramaMapper.toDTO(salvo);
    }

    /**
     * Importa múltiplos pictogramas de uma vez
     */
    public List<PictogramaDTO> importarLote(List<PictogramaImportRequest> requests, Long usuarioId) {
        log.info("📥 Importando lote de {} pictogramas", requests.size());

        List<PictogramaDTO> importados = new ArrayList<>();

        for (PictogramaImportRequest request : requests) {
            try {
                PictogramaDTO importado = importarPictograma(
                        request.getIdExterno(),
                        request.getCategoriaId(),
                        usuarioId,
                        request.isColorido()
                );
                importados.add(importado);
            } catch (Exception e) {
                log.error("Erro ao importar pictograma {}: {}", request.getIdExterno(), e.getMessage());
                // Continua importando os outros
            }
        }

        log.info("✅ Lote importado: {}/{} pictogramas", importados.size(), requests.size());
        return importados;
    }

    /**
     * Sugere pictogramas relevantes para um texto
     */
    public List<PictogramaExternoDTO> sugerirPictogramasParaTexto(String texto, int limite) {
        log.info("💡 Sugerindo pictogramas para: {}", texto);

        // Divide o texto em palavras
        List<String> palavras = Arrays.stream(texto.split("\\s+"))
                .filter(p -> p.length() > 2) // Ignora palavras muito curtas
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());

        // Busca pictogramas para cada palavra
        List<PictogramaExternoDTO> sugestoes = arasaacService.buscarMultiplaspalavras(
                palavras,
                Math.max(1, limite / palavras.size())
        );

        return sugestoes.stream()
                .limit(limite)
                .collect(Collectors.toList());
    }

    /**
     * Marca quais pictogramas já foram importados pelo usuário
     */
    public List<PictogramaExternoDTO> marcarImportados(List<PictogramaExternoDTO> externos, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        // Busca todos os pictogramas do usuário
        List<Pictograma> pictogramasUsuario = pictogramaRepository.findByUsuarioAndAtivoTrue(usuario);

        // Marca os que já foram importados
        for (PictogramaExternoDTO externo : externos) {
            boolean importado = pictogramasUsuario.stream()
                    .anyMatch(p -> p.getLabel().equalsIgnoreCase(externo.getLabel()));

            externo.setImportado(importado);

            if (importado) {
                Pictograma pic = pictogramasUsuario.stream()
                        .filter(p -> p.getLabel().equalsIgnoreCase(externo.getLabel()))
                        .findFirst()
                        .orElse(null);

                if (pic != null) {
                    externo.setPictogramaVoxId(pic.getId());
                }
            }
        }

        return externos;
    }

    // ===========================================
    // MÉTODOS AUXILIARES
    // ===========================================

    /**
     * Determina a cor baseado na categoria
     */
    private String determinarCor(Categoria categoria) {
        if (categoria.getCor() != null && !categoria.getCor().isEmpty()) {
            return categoria.getCor();
        }
        return "bg-blue-400"; // Cor padrão
    }

    /**
     * Obtém a próxima ordem disponível na categoria
     */
    private Integer obterProximaOrdem(Categoria categoria) {
        long count = pictogramaRepository.countByCategoriaAndAtivoTrue(categoria);
        return (int) count + 1;
    }
}