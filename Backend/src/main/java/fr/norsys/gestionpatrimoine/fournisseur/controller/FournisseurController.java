package fr.norsys.gestionpatrimoine.fournisseur.controller;

import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoRequest;
import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoResponse;
import fr.norsys.gestionpatrimoine.fournisseur.service.FournisseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {
    @Autowired
    private FournisseurService fournisseurService;
    @PostMapping
    ResponseEntity<FournisseurDtoResponse> addFournisseur(@RequestBody FournisseurDtoRequest fournisseur) {
        FournisseurDtoResponse response = fournisseurService.addFournisseur(fournisseur);
        return ResponseEntity.ok(response);
    }
    @GetMapping("{id}")
    FournisseurDtoResponse getFournisseurById(@PathVariable Long id) {
        return fournisseurService.findFournisseurById(id);
    }
    @GetMapping
    List<FournisseurDtoResponse> findAll() {
        return fournisseurService.findAllFournisseurs();
    }
    @PutMapping("{id}")
    ResponseEntity<FournisseurDtoResponse> updateFournisseur(@RequestBody FournisseurDtoRequest fournisseur, @PathVariable Long id) {
        FournisseurDtoResponse response = fournisseurService.updateFournisseur(id, fournisseur);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    void deleteById(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
    }
}
