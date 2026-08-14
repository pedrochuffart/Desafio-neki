package br.com.desafio.backend.dto;

public record UsuarioSkillResponseDTO(
        Integer id,
        Integer usuarioId,
        Integer skillId,
        String level
) {
}
