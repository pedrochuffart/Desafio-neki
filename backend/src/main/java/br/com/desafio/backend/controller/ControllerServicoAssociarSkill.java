package br.com.desafio.backend.controller;

import br.com.desafio.backend.dto.UsuarioSkillRequestDTO;
import br.com.desafio.backend.dto.UsuarioSkillResponseDTO;
import br.com.desafio.backend.service.ServiceServicoAssociarSkill;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario-skill")
public class ControllerServicoAssociarSkill {

    private final ServiceServicoAssociarSkill service;

    public ControllerServicoAssociarSkill(
            ServiceServicoAssociarSkill service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UsuarioSkillResponseDTO> associar(
            @Valid @RequestBody UsuarioSkillRequestDTO dados
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.associar(dados));
    }
}