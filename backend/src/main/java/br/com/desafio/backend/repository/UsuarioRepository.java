package br.com.desafio.backend.repository;

import br.com.desafio.backend.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

    Optional<UsuarioEntity> findByLogin(String login);

    boolean existsByLogin(String login);
}
