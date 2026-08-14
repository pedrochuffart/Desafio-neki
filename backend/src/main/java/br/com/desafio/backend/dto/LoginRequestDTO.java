package br.com.desafio.backend.dto;

public record LoginRequestDTO(
        String login,
        String senha
) {
}