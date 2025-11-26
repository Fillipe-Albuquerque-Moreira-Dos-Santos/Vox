package com.acessibilidade.projeto.acessibilidade.service;

import com.acessibilidade.projeto.acessibilidade.entity.Usuario;
import com.acessibilidade.projeto.acessibilidade.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repo;

    public Usuario salvar(Usuario usuario) {
        return repo.save(usuario);
    }

    public List<Usuario> listar() {
        return repo.findAll();
    }
}
