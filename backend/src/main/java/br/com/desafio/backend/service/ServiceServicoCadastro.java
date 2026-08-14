package br.com.desafio.backend.service;

import br.com.desafio.backend.dto.CadastroRequestDTO;
import br.com.desafio.backend.dto.CadastroResponseDTO;
import br.com.desafio.backend.entity.UsuarioEntity;
import br.com.desafio.backend.exception.RegraNegocioException;
import br.com.desafio.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServiceServicoCadastro {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ServiceServicoCadastro(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CadastroResponseDTO cadastrar(CadastroRequestDTO dados) {

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

        if (usuarioRepository.existsByLogin(dados.login())) {
            throw new RegraNegocioException(
                    "Login já cadastrado"
            );
        }

        UsuarioEntity usuario = new UsuarioEntity();

        usuario.setLogin(dados.login());

        usuario.setSenha(
                passwordEncoder.encode(dados.senha())
        );

        usuarioRepository.save(usuario);

        return new CadastroResponseDTO(
                "Cadastro realizado com sucesso"
        );
    }
}