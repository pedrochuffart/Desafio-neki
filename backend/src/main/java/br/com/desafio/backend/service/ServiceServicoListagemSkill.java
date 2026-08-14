package br.com.desafio.backend.service;

import br.com.desafio.backend.dto.SkillResponseDTO;
import br.com.desafio.backend.entity.SkillEntity;
import br.com.desafio.backend.entity.UsuarioSkillEntity;
import br.com.desafio.backend.exception.RecursoNaoEncontradoException;
import br.com.desafio.backend.repository.SkillRepository;
import br.com.desafio.backend.repository.UsuarioRepository;
import br.com.desafio.backend.repository.UsuarioSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceServicoListagemSkill {

    private final UsuarioSkillRepository usuarioSkillRepository;
    private final UsuarioRepository usuarioRepository;
    private final SkillRepository skillRepository;

    public ServiceServicoListagemSkill(
            UsuarioSkillRepository usuarioSkillRepository,
            UsuarioRepository usuarioRepository,
            SkillRepository skillRepository
    ) {
        this.usuarioSkillRepository = usuarioSkillRepository;
        this.usuarioRepository = usuarioRepository;
        this.skillRepository = skillRepository;
    }

    /**
     * Lista as Skills que o usuário já possui.
     */
    public List<SkillResponseDTO> listarPorUsuario(
            Integer usuarioId
    ) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RecursoNaoEncontradoException(
                    "Usuário não encontrado"
            );
        }

        return usuarioSkillRepository
                .findByUsuarioId(usuarioId)
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    /**
     * Lista todas as Skills disponíveis
     * para preenchimento da combo.
     */
    public List<SkillResponseDTO> listarTodas() {

        return skillRepository
                .findAll()
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    /**
     * Converte a associação UsuarioSkillEntity.
     *
     * IMPORTANTE:
     * O ID retornado aqui é o ID da associação
     * usuario_skill, pois ele será utilizado
     * para atualizar e excluir a associação.
     */
    private SkillResponseDTO converterParaDTO(
            UsuarioSkillEntity usuarioSkill
    ) {

        return new SkillResponseDTO(
                usuarioSkill.getId(),
                usuarioSkill.getSkill().getNome(),
                usuarioSkill.getSkill().getDescricao(),
                usuarioSkill.getSkill().getImagem(),
                usuarioSkill.getLevel()
        );
    }

    /**
     * Converte uma Skill disponível.
     *
     * Aqui continua sendo utilizado o ID
     * da própria Skill, pois esse ID será
     * utilizado para criar uma nova associação.
     */
    private SkillResponseDTO converterParaDTO(
            SkillEntity skill
    ) {

        return new SkillResponseDTO(
                skill.getId(),
                skill.getNome(),
                skill.getDescricao(),
                skill.getImagem(),
                null
        );
    }
}