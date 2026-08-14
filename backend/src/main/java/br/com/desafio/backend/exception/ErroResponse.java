package br.com.desafio.backend.exception;

import java.time.LocalDateTime;

public record ErroResponse(
        LocalDateTime data,
        int status,
        String erro,
        String mensagem
) {
}