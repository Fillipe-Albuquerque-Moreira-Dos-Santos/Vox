package com.vox.projeto.vox.controller;

import com.vox.projeto.vox.Enums.Role;
import com.vox.projeto.vox.dto.LoginDTO;
import com.vox.projeto.vox.dto.RegisterDTO;
import com.vox.projeto.vox.dto.RegisterResponseDTO;
import com.vox.projeto.vox.dto.TokenDTO;
import com.vox.projeto.vox.entity.Usuario;
import com.vox.projeto.vox.repository.UsuarioRepository;
import com.vox.projeto.vox.security.jwt.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final DataSource dataSource;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<RegisterResponseDTO> registrar(@RequestBody RegisterDTO dto) {
        String senhaEncoded = encoder.encode(dto.getPassword());

        Usuario novo = Usuario.builder().nome(dto.getNome()).telefone(dto.getTelefone()).email(dto.getEmail()).password(senhaEncoded).role(Role.USER).build();
        Usuario salvo = usuarioRepository.saveAndFlush(novo);
        RegisterResponseDTO response = RegisterResponseDTO.builder()
                .success(true)
                .message("Usuário registrado com sucesso!")
                .userId(salvo.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginDTO dto) {
        System.out.println("🔍 Username recebido: [" + dto.username() + "]");
        System.out.println("🔍 Password recebido: [" + dto.password() + "]");

        Usuario usuario = usuarioRepository.findByEmail(dto.username())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + dto.username()));

        System.out.println("✅ Usuário encontrado: " + usuario.getNome());

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
