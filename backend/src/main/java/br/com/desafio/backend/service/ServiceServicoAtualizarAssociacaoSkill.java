package br.com.desafio.backend.service;

import br.com.desafio.backend.dto.UsuarioSkillResponseDTO;
import br.com.desafio.backend.dto.UsuarioSkillUpdateDTO;
import br.com.desafio.backend.entity.UsuarioSkillEntity;
import br.com.desafio.backend.exception.RecursoNaoEncontradoException;
import br.com.desafio.backend.exception.RegraNegocioException;
import br.com.desafio.backend.repository.UsuarioSkillRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceServicoAtualizarAssociacaoSkill {

    private final UsuarioSkillRepository usuarioSkillRepository;

    public ServiceServicoAtualizarAssociacaoSkill(
            UsuarioSkillRepository usuarioSkillRepository
    ) {
        this.usuarioSkillRepository = usuarioSkillRepository;
    }

    public UsuarioSkillResponseDTO atualizar(
            Integer id,
            UsuarioSkillUpdateDTO dados
    ) {

        if (id == null) {
                throw new RegraNegocioException(
                        "O ID da associação é obrigatório"
                );
        }

        if (dados.level() == null || dados.level().isBlank()) {
                throw new RegraNegocioException(
                        "O nível é obrigatório"
                );
        }

        UsuarioSkillEntity usuarioSkill =
                usuarioSkillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RecursoNaoEncontradoException(
                                        "Associação de Skill não encontrada"
                                )
                        );

        usuarioSkill.setLevel(dados.level());

        usuarioSkill =
                usuarioSkillRepository.save(usuarioSkill);

        return new UsuarioSkillResponseDTO(
                usuarioSkill.getId(),
                usuarioSkill.getUsuario().getId(),
                usuarioSkill.getSkill().getId(),
                usuarioSkill.getLevel()
        );
        }
}
