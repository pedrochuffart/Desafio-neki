package br.com.desafio.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> tratarNaoEncontrado(
            RecursoNaoEncontradoException exception
    ) {

        ErroResponse erro = new ErroResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Recurso não encontrado",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(erro);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> tratarRegraNegocio(
            RegraNegocioException exception
    ) {

        ErroResponse erro = new ErroResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Regra de negócio",
                exception.getMessage()
        );

        return ResponseEntity
                .badRequest()
                .body(erro);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarErroGenerico(
            Exception exception
    ) {

        ErroResponse erro = new ErroResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(erro);
    }
}