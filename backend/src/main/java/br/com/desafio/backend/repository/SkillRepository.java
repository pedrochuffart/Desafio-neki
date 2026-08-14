package br.com.desafio.backend.repository;

import br.com.desafio.backend.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<SkillEntity, Integer> {

}
