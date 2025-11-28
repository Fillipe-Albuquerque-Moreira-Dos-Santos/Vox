package com.vox.projeto.vox.repository;

import com.vox.projeto.vox.entity.Categoria;
import com.vox.projeto.vox.entity.Pictograma;
import com.vox.projeto.vox.entity.TipoPictograma;
import com.vox.projeto.vox.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PictogramaRepository extends JpaRepository<Pictograma, Long> {

    List<Pictograma> findByCategoriaAndAtivoTrueOrderByOrdemAsc(Categoria categoria);

    List<Pictograma> findByPadraoTrueAndAtivoTrue();

    List<Pictograma> findByUsuarioAndAtivoTrue(Usuario usuario);

    @Query("SELECT p FROM Pictograma p WHERE (p.padrao = true OR p.usuario = :usuario) AND p.ativo = true AND p.categoria = :categoria ORDER BY p.ordem ASC")
    List<Pictograma> findPictogramasDisponiveisParaUsuario(@Param("usuario") Usuario usuario, @Param("categoria") Categoria categoria);

    List<Pictograma> findByTipoAndAtivoTrue(TipoPictograma tipo);

    @Query("SELECT p FROM Pictograma p WHERE p.usuario = :usuario AND p.ativo = true ORDER BY p.vezesUsado DESC")
    List<Pictograma> findMaisUsadosPorUsuario(@Param("usuario") Usuario usuario);

    @Query("SELECT p FROM Pictograma p WHERE LOWER(p.label) LIKE LOWER(CONCAT('%', :termo, '%')) AND p.ativo = true")
    List<Pictograma> buscarPorLabel(@Param("termo") String termo);

    @Query("SELECT p FROM Pictograma p WHERE (LOWER(p.label) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.labelAlternativo) LIKE LOWER(CONCAT('%', :termo, '%'))) AND p.ativo = true")
    List<Pictograma> buscarPorLabelOuAlternativo(@Param("termo") String termo);

    boolean existsByLabelAndCategoriaAndUsuario(String label, Categoria categoria, Usuario usuario);

    long countByCategoriaAndAtivoTrue(Categoria categoria);

    Optional<Pictograma> findByIdAndUsuario(Long id, Usuario usuario);
}