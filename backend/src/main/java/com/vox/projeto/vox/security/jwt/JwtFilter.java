package com.vox.projeto.vox.security.jwt;

import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);

                // Valida o token antes de processar
                if (jwtService.validarToken(token)) {
                    String email = jwtService.extrairEmail(token);

                    Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

                    if (usuario != null) {
                        // Cria lista de authorities
                        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                        // Se sua entidade Usuario tiver o campo role, descomente:
                        // authorities.add(new SimpleGrantedAuthority(usuario.getRole().name()));

                        // Ou se tiver uma lista de roles:
                        // usuario.getRoles().forEach(role ->
                        //     authorities.add(new SimpleGrantedAuthority(role.name()))
                        // );

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        usuario, null, authorities
                                );

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // Token inválido, apenas continua sem autenticar
                System.err.println("Erro ao processar JWT: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}