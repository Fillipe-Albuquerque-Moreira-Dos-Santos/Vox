package com.vox.projeto.vox.repository;

import com.vox.projeto.vox.entity.ConfiguracaoUsuario;
import com.vox.projeto.vox.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracaoUsuarioRepository extends JpaRepository<ConfiguracaoUsuario, Long> {

    Optional<ConfiguracaoUsuario> findByUsuario(Usuario usuario);

    boolean existsByUsuario(Usuario usuario);
}