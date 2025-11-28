package com.vox.projeto.vox.repository;

import com.vox.projeto.vox.entity.Categoria;
import com.vox.projeto.vox.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByPadraoTrueAndAtivaTrue();

    List<Categoria> findByUsuarioAndAtivaTrue(Usuario usuario);

    List<Categoria> findByUsuarioAndAtivaOrderByOrdemAsc(Usuario usuario, Boolean ativa);

    @Query("SELECT c FROM Categoria c WHERE (c.padrao = true OR c.usuario = :usuario) AND c.ativa = true ORDER BY c.ordem ASC")
    List<Categoria> findCategoriasDisponiveisParaUsuario(@Param("usuario") Usuario usuario);

    boolean existsByNomeAndUsuario(String nome, Usuario usuario);

    long countByUsuarioAndAtivaTrue(Usuario usuario);

    Optional<Categoria> findByIdAndUsuario(Long id, Usuario usuario);
}