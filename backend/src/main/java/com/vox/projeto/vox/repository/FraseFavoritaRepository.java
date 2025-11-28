package com.vox.projeto.vox.repository;

import com.vox.projeto.vox.entity.FraseFavorita;
import com.vox.projeto.vox.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FraseFavoritaRepository extends JpaRepository<FraseFavorita, Long> {

    List<FraseFavorita> findByUsuarioAndAtivaOrderByOrdemAsc(Usuario usuario, Boolean ativa);

    @Query("SELECT f FROM FraseFavorita f WHERE f.usuario = :usuario AND f.ativa = true ORDER BY f.vezesUsada DESC")
    List<FraseFavorita> findMaisUsadas(@Param("usuario") Usuario usuario);

    boolean existsByTituloAndUsuario(String titulo, Usuario usuario);

    long countByUsuarioAndAtivaTrue(Usuario usuario);

    Optional<FraseFavorita> findByIdAndUsuario(Long id, Usuario usuario);
}