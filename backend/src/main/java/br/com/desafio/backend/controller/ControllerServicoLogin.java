package br.com.desafio.backend.controller;

import br.com.desafio.backend.dto.LoginRequestDTO;
import br.com.desafio.backend.dto.LoginResponseDTO;
import br.com.desafio.backend.service.ServiceServicoLogin;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class ControllerServicoLogin {

    private final ServiceServicoLogin service;

    public ControllerServicoLogin(ServiceServicoLogin service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dados
    ) {
        return ResponseEntity.ok(service.login(dados));
    }
}