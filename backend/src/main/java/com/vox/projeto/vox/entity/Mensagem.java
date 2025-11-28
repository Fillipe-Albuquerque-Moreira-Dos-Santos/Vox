package com.vox.projeto.vox.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conteudo_json", nullable = false, columnDefinition = "TEXT")
    private String conteudoJson;

    @Column(name = "texto_completo", nullable = false, columnDefinition = "TEXT")
    private String textoCompleto;

    @Column(name = "contexto", length = 500)
    private String contexto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "favorita", nullable = false)
    private Boolean favorita;

    @Column(name = "vezes_reutilizada", nullable = false)
    private Integer vezesReutilizada;

    @Column(name = "dispositivo_origem", length = 50)
    private String dispositivoOrigem;

    // Métodos de negócio
    public void toggleFavorita() {
        this.favorita = !this.favorita;
    }

    public void reutilizar() {
        this.vezesReutilizada++;
    }
}