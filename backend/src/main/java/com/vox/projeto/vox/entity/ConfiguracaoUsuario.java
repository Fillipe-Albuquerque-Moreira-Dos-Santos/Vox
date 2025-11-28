package com.vox.projeto.vox.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "configuracoes_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracaoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    // Configurações de Interface
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TamanhoPictograma tamanhoPictograma = TamanhoPictograma.MEDIO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean modoAltoContraste = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean modoEscuro = false;

    // Configurações de Som
    @Column(nullable = false)
    @Builder.Default
    private Boolean habilitarSom = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer velocidadeVoz = 1; // 1 = normal, 2 = rápido, 0 = lento

    @Column(length = 10)
    @Builder.Default
    private String idiomaVoz = "pt-BR";

    // Configurações de Acessibilidade
    @Column(nullable = false)
    @Builder.Default
    private Boolean modoVarredura = false; // Scanning mode

    @Column(nullable = false)
    @Builder.Default
    private Integer tempoVarredura = 3; // segundos

    @Column(nullable = false)
    @Builder.Default
    private Boolean confirmarSelecao = false;

    // Configurações de Terapia/Analytics
    @Column(nullable = false)
    @Builder.Default
    private Boolean salvarHistorico = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean permitirRelatorios = true;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;
}