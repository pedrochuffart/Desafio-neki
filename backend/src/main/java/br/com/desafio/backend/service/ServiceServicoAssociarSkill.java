package br.com.desafio.backend.service;

import br.com.desafio.backend.dto.UsuarioSkillRequestDTO;
import br.com.desafio.backend.dto.UsuarioSkillResponseDTO;
import br.com.desafio.backend.entity.SkillEntity;
import br.com.desafio.backend.entity.UsuarioEntity;
import br.com.desafio.backend.entity.UsuarioSkillEntity;
import br.com.desafio.backend.exception.RecursoNaoEncontradoException;
import br.com.desafio.backend.exception.RegraNegocioException;
import br.com.desafio.backend.repository.SkillRepository;
import br.com.desafio.backend.repository.UsuarioRepository;
import br.com.desafio.backend.repository.UsuarioSkillRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceServicoAssociarSkill {

    private final UsuarioRepository usuarioRepository;
    private final SkillRepository skillRepository;
    private final UsuarioSkillRepository usuarioSkillRepository;

    public ServiceServicoAssociarSkill(
            UsuarioRepository usuarioRepository,
            SkillRepository skillRepository,
            UsuarioSkillRepository usuarioSkillRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.skillRepository = skillRepository;
        this.usuarioSkillRepository = usuarioSkillRepository;
    }

    public UsuarioSkillResponseDTO associar(
            UsuarioSkillRequestDTO dados
    ) {

        if (dados.usuarioId() == null) {
            throw new RegraNegocioException(
                    "O usuário é obrigatório"
            );
        }

        if (dados.skillId() == null) {
            throw new RegraNegocioException(
                    "A Skill é obrigatória"
            );
        }

        if (dados.level() == null || dados.level().isBlank()) {
            throw new RegraNegocioException(
                    "O nível é obrigatório"
            );
        }

        UsuarioEntity usuario = usuarioRepository
                .findById(dados.usuarioId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Usuário não encontrado"
                        )
                );

        SkillEntity skill = skillRepository
                .findById(dados.skillId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Skill não encontrada"
                        )
                );

        if (usuarioSkillRepository
                .existsByUsuarioIdAndSkillId(
                        dados.usuarioId(),
                        dados.skillId()
                )) {

            throw new RegraNegocioException(
                    "Usuário já possui essa Skill"
            );
        }

        UsuarioSkillEntity usuarioSkill =
                new UsuarioSkillEntity();

        usuarioSkill.setUsuario(usuario);
        usuarioSkill.setSkill(skill);
        usuarioSkill.setLevel(dados.level());

        usuarioSkill =
                usuarioSkillRepository.save(usuarioSkill);

        return new UsuarioSkillResponseDTO(
                usuarioSkill.getId(),
                usuario.getId(),
                skill.getId(),
                usuarioSkill.getLevel()
        );
    }
}
