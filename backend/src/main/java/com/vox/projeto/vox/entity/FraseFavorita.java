package com.vox.projeto.vox.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "frases_favoritas", indexes = {
        @Index(name = "idx_frase_usuario", columnList = "usuario_id"),
        @Index(name = "idx_frase_ativa", columnList = "ativa")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraseFavorita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo; // "Quero água", "Oi, tudo bem?"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudoJson; // Array dos pictogramas

    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoCompleto;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativa = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer ordem = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer vezesUsada = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    public void incrementarUso() {
        this.vezesUsada++;
    }
}