package com.vox.projeto.vox.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias", indexes = {
        @Index(name = "idx_categoria_usuario", columnList = "usuario_id"),
        @Index(name = "idx_categoria_ativa", columnList = "ativa")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false, length = 50)
    private String cor; // Ex: "bg-pink-500", "#FF5733"

    @Column(length = 50)
    private String icone; // Nome do ícone ou emoji

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativa = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean padrao = false; // True = categoria do sistema, False = personalizada

    @Column(nullable = false)
    @Builder.Default
    private Integer ordem = 0; // Para ordenação customizada

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // null = categoria padrão do sistema

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Pictograma> pictogramas = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    // Método helper para adicionar pictograma
    public void adicionarPictograma(Pictograma pictograma) {
        pictogramas.add(pictograma);
        pictograma.setCategoria(this);
    }

    // Método helper para remover pictograma
    public void removerPictograma(Pictograma pictograma) {
        pictogramas.remove(pictograma);
        pictograma.setCategoria(null);
    }
}
