package br.com.desafio.backend.dto;

public record SkillRequestDTO(
        String nome,
        String descricao,
        String imagem
) {
}