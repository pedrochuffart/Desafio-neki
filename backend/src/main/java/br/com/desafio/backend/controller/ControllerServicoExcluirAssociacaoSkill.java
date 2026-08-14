package br.com.desafio.backend.controller;

import br.com.desafio.backend.service.ServiceServicoExcluirAssociacaoSkill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario-skill")
public class ControllerServicoExcluirAssociacaoSkill {

    private final ServiceServicoExcluirAssociacaoSkill service;

    public ControllerServicoExcluirAssociacaoSkill(
            ServiceServicoExcluirAssociacaoSkill service
    ) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer id
    ) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
