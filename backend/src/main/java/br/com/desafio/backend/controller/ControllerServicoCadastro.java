package br.com.desafio.backend.controller;

import br.com.desafio.backend.dto.CadastroRequestDTO;
import br.com.desafio.backend.dto.CadastroResponseDTO;
import br.com.desafio.backend.service.ServiceServicoCadastro;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cadastro")
public class ControllerServicoCadastro {

    private final ServiceServicoCadastro service;

    public ControllerServicoCadastro(ServiceServicoCadastro service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CadastroResponseDTO> cadastrar(
            @Valid @RequestBody CadastroRequestDTO dados
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.cadastrar(dados));
    }
}