package com.vox.projeto.vox.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pictogramas", indexes = {
        @Index(name = "idx_pictograma_categoria", columnList = "categoria_id"),
        @Index(name = "idx_pictograma_usuario", columnList = "usuario_id"),
        @Index(name = "idx_pictograma_ativo", columnList = "ativo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pictograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String label; // Texto exibido

    @Column(length = 200)
    private String labelAlternativo; // Sinônimos para busca

    @Column(nullable = false, length = 50)
    private String cor; // Ex: "bg-blue-500"

    @Column(length = 100)
    private String icone; // Emoji ou nome do ícone (lucide-react)

    @Column(length = 1000)
    private String imagemUrl; // URL da imagem customizada (S3, Cloudinary, etc)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TipoPictograma tipo = TipoPictograma.PADRAO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean padrao = false; // True = do sistema, False = personalizado

    @Column(nullable = false)
    @Builder.Default
    private Integer ordem = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer vezesUsado = 0; // Contador de uso para analytics

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // null = pictograma padrão do sistema

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    // Método helper para incrementar uso
    public void incrementarUso() {
        this.vezesUsado++;
    }
}