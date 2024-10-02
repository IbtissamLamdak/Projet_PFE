package fr.norsys.gestionpatrimoine.patrimoine.actif.controller;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.actif.service.ActifCategorieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/actifs/categories")
public class ActifCategorieController {
    private final ActifCategorieService categoryService;
    @PostMapping
    public ResponseEntity<ActifCategorieDto> createCategorie(
            @Valid @RequestBody ActifCategorieDto request) {
        ActifCategorieDto response = categoryService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{categorieId}")
    public ResponseEntity<ActifCategorieDto> getCategorieById(
            @PathVariable(name = "categorieId") Long id
    ) {
        ActifCategorieDto response = categoryService.getById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<ActifCategorieDto>> getAllCategories() {
        List<ActifCategorieDto> responses = categoryService.getAll();
        return ResponseEntity.ok(responses);
    }
    @PutMapping("/{categorieId}")
    public ResponseEntity<ActifCategorieDto> updateCategorie(
            @PathVariable(name = "categorieId") Long id, @Valid @RequestBody ActifCategorieDto request
    ) {
        ActifCategorieDto response = categoryService.update(id, request);
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
