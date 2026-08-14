package br.com.desafio.backend.service;

import br.com.desafio.backend.dto.LoginRequestDTO;
import br.com.desafio.backend.dto.LoginResponseDTO;
import br.com.desafio.backend.entity.UsuarioEntity;
import br.com.desafio.backend.exception.RegraNegocioException;
import br.com.desafio.backend.repository.UsuarioRepository;
import br.com.desafio.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServiceServicoLogin {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public ServiceServicoLogin(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO dados) {

        if (dados.login() == null || dados.login().isBlank()) {
            throw new RegraNegocioException(
                    "O login é obrigatório"
            );
        }

        if (dados.senha() == null || dados.senha().isBlank()) {
            throw new RegraNegocioException(
                    "A senha é obrigatória"
            );
        }

        UsuarioEntity usuario = usuarioRepository
                .findByLogin(dados.login())
                .orElseThrow(() ->
                        new RegraNegocioException(
                                "Login ou senha inválidos"
                        )
                );

        boolean senhaValida = passwordEncoder.matches(
                dados.senha(),
                usuario.getSenha()
        );

        if (!senhaValida) {
            throw new RegraNegocioException(
                    "Login ou senha inválidos"
            );
        }

        String token = jwtService.gerarToken(usuario);

        return new LoginResponseDTO(token);
    }
}