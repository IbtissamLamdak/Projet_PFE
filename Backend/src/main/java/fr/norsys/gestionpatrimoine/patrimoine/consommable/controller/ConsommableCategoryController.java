package fr.norsys.gestionpatrimoine.patrimoine.consommable.controller;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.service.ConsommableCategorieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consommables/categories")
public class ConsommableCategoryController {
    private final ConsommableCategorieService categoryService;
    @PostMapping
    public ResponseEntity<ConsommableCategorieDto> createCategorie(
            @Valid @RequestBody ConsommableCategorieDto request) {
        ConsommableCategorieDto response = categoryService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{categorieId}")
    public ResponseEntity<ConsommableCategorieDto> getCategorieById(
            @PathVariable(name = "categorieId") Long id
    ) {
        ConsommableCategorieDto response = categoryService.getById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<ConsommableCategorieDto>> getAllCategories() {
        List<ConsommableCategorieDto> responses = categoryService.getAll();
        return ResponseEntity.ok(responses);
    }
    @PutMapping("/{categorieId}")
    public ResponseEntity<ConsommableCategorieDto> updateCategorie(
            @PathVariable(name = "categorieId") Long id, @Valid @RequestBody ConsommableCategorieDto request
    ) {
        ConsommableCategorieDto response = categoryService.update(id, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{categorieId}")
    public ResponseEntity<?> deleteCategorie(
            @PathVariable(name = "categorieId") Long id
    ) {
        categoryService.delete(id);
        return ResponseEntity.ok("deleted successfully");
    }
}
