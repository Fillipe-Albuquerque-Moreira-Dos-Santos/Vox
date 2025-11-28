package com.vox.projeto.vox.repository;

import com.vox.projeto.vox.entity.Mensagem;
import com.vox.projeto.vox.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    Page<Mensagem> findByUsuarioOrderByCriadoEmDesc(Usuario usuario, Pageable pageable);

    List<Mensagem> findByUsuarioAndFavoritaTrueOrderByCriadoEmDesc(Usuario usuario);

    List<Mensagem> findByUsuarioAndCriadoEmBetweenOrderByCriadoEmDesc(
            Usuario usuario,
            LocalDateTime inicio,
            LocalDateTime fim
    );

    List<Mensagem> findByUsuarioAndContextoOrderByCriadoEmDesc(Usuario usuario, String contexto);

    @Query("SELECT m FROM Mensagem m WHERE m.usuario = :usuario ORDER BY m.vezesReutilizada DESC")
    List<Mensagem> findMaisReutilizadas(@Param("usuario") Usuario usuario, Pageable pageable);

    long countByUsuario(Usuario usuario);

    long countByUsuarioAndCriadoEmBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fim);

    List<Mensagem> findTop10ByUsuarioOrderByCriadoEmDesc(Usuario usuario);

    List<Mensagem> findByUsuarioAndDispositivoOrigemOrderByCriadoEmDesc(Usuario usuario, String dispositivo);
}