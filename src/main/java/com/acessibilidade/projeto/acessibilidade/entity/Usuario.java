package com.acessibilidade.projeto.acessibilidade.entity;

import com.acessibilidade.projeto.acessibilidade.Enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String telefone;

    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String password;
}
