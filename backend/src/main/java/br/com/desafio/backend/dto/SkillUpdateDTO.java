package br.com.desafio.backend.dto;

public record SkillUpdateDTO(
        String nome,
        String descricao,
        String imagem
) {
}