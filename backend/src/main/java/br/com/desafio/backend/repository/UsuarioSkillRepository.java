package br.com.desafio.backend.repository;

import br.com.desafio.backend.entity.UsuarioSkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioSkillRepository extends JpaRepository<UsuarioSkillEntity, Integer> {

    List<UsuarioSkillEntity> findByUsuarioId(Integer usuarioId);

    boolean existsByUsuarioIdAndSkillId(Integer usuarioId, Integer skillId);
}
