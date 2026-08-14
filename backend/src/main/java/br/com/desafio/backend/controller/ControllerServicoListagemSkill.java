package br.com.desafio.backend.controller;

import br.com.desafio.backend.dto.SkillResponseDTO;
import br.com.desafio.backend.service.ServiceServicoListagemSkill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class ControllerServicoListagemSkill {

    private final ServiceServicoListagemSkill service;

    public ControllerServicoListagemSkill(
            ServiceServicoListagemSkill service
    ) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SkillResponseDTO>> listarTodas() {
        return ResponseEntity.ok(
                service.listarTodas()
        );
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SkillResponseDTO>> listarPorUsuario(
            @PathVariable Integer usuarioId
    ) {
        return ResponseEntity.ok(
                service.listarPorUsuario(usuarioId)
        );
    }
}