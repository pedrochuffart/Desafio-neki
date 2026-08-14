package br.com.desafio.backend.dto;

public record CadastroRequestDTO(
        String login,
        String senha
) {
}