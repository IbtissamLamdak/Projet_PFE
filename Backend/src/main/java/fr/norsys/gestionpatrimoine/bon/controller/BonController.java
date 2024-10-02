package fr.norsys.gestionpatrimoine.bon.controller;

import fr.norsys.gestionpatrimoine.bon.dto.BonDtoRequest;
import fr.norsys.gestionpatrimoine.bon.dto.BonDtoResponse;
import fr.norsys.gestionpatrimoine.bon.service.BonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bons")
public class BonController {
    @Autowired
    private BonService bonService;
    @PostMapping
    ResponseEntity<BonDtoResponse> addBon(@RequestBody BonDtoRequest bon) {
        BonDtoResponse response = bonService.addBon(bon);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    BonDtoResponse getBonById(@PathVariable String id) {
        return bonService.findBonById(id);
    }
    @GetMapping
    List<BonDtoResponse> findAll() {
        System.out.println("Tous les bons affichés correctement");
        return bonService.findAllBons();
    }
    @PutMapping("{id}")
    ResponseEntity<BonDtoResponse> updateBon(@RequestBody BonDtoRequest bon, @PathVariable String id) {
        BonDtoResponse response = bonService.updateBon(id, bon);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    void deleteById(@PathVariable String id) {
        bonService.deleteBon(id);
    }
}
