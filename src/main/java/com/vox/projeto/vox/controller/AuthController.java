package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.Enums.Role;
import com.vox.projeto.vox.dto.LoginDTO;
import com.vox.projeto.vox.dto.RegisterDTO;
import com.vox.projeto.vox.dto.TokenDTO;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.repository.UsuarioRepository;
import com.vox.projeto.vox.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegisterDTO dto) {

        Usuario novo = Usuario.builder()
                .nome(dto.nome())
                .telefone(dto.telefone())
                .email(dto.email())
                .password(encoder.encode(dto.password()))
                .role(Role.USER)
                .build();

        usuarioRepository.save(novo);

        return ResponseEntity.ok("Usuário registrado!");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginDTO dto) {

        Usuario usuario = usuarioRepository.findByEmail(dto.username())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!encoder.matches(dto.password(), usuario.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.gerarToken(usuario.getEmail());

        return ResponseEntity.ok(new TokenDTO(token));
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> me(Authentication auth) {
        return ResponseEntity.ok((Usuario) auth.getPrincipal());
    }
}
