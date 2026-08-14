package br.com.desafio.backend.dto;

public record UsuarioSkillRequestDTO(
        Integer usuarioId,
        Integer skillId,
        String level
) {
}
