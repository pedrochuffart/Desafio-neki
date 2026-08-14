package br.com.desafio.backend.dto;

public record SkillResponseDTO(
        Integer id,
        String nome,
        String descricao,
        String imagem,
        String level
) {
}
