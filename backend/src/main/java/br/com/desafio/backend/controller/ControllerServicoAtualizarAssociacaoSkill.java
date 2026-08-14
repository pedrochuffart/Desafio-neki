package br.com.desafio.backend.controller;

import br.com.desafio.backend.dto.UsuarioSkillResponseDTO;
import br.com.desafio.backend.dto.UsuarioSkillUpdateDTO;
import br.com.desafio.backend.service.ServiceServicoAtualizarAssociacaoSkill;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario-skill")
public class ControllerServicoAtualizarAssociacaoSkill {

    private final ServiceServicoAtualizarAssociacaoSkill service;

    public ControllerServicoAtualizarAssociacaoSkill(
            ServiceServicoAtualizarAssociacaoSkill service
    ) {
        this.service = service;
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioSkillResponseDTO> atualizar(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioSkillUpdateDTO dados
    ) {
        return ResponseEntity.ok(
                service.atualizar(id, dados)
        );
    }
}
