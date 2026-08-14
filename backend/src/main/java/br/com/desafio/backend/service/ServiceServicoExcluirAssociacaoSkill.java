package br.com.desafio.backend.service;

import br.com.desafio.backend.exception.RecursoNaoEncontradoException;
import br.com.desafio.backend.exception.RegraNegocioException;
import br.com.desafio.backend.repository.UsuarioSkillRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceServicoExcluirAssociacaoSkill {

    private final UsuarioSkillRepository usuarioSkillRepository;

    public ServiceServicoExcluirAssociacaoSkill(
            UsuarioSkillRepository usuarioSkillRepository
    ) {
        this.usuarioSkillRepository = usuarioSkillRepository;
    }

    public void excluir(Integer id) {

        if (id == null) {
            throw new RegraNegocioException(
                    "O ID da associação é obrigatório"
            );
        }

        if (!usuarioSkillRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException(
                    "Associação de Skill não encontrada"
            );
        }

        usuarioSkillRepository.deleteById(id);
    }
}
