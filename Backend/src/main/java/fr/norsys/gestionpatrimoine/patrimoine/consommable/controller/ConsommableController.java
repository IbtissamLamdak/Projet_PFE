package fr.norsys.gestionpatrimoine.patrimoine.consommable.controller;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.service.ConsommableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consommables")
public class ConsommableController {
    private final ConsommableService consommableService;
    @PostMapping
    public ResponseEntity<ConsommableDtoResponse> createConsommable(
            @Valid @RequestBody ConsommableDtoRequest request) {
        ConsommableDtoResponse response = consommableService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{consommableId}")
    public ResponseEntity<ConsommableDtoResponse> getConsommableById(
            @PathVariable(name = "consommableId") Long id
    ) {
        ConsommableDtoResponse response = consommableService.getById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<ConsommableDtoResponse>> getAllConsommable() {
        List<ConsommableDtoResponse> responses = consommableService.getAll();
        return ResponseEntity.ok(responses);
    }
    @PutMapping("/{consommableId}")
    public ResponseEntity<ConsommableDtoResponse> updateConsommable(
            @PathVariable(name = "consommableId") Long id, @Valid @RequestBody ConsommableDtoRequest request
    ) {
        ConsommableDtoResponse response = consommableService.update(id, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{consommableId}")
    public ResponseEntity<?> deleteConsommable(
            @PathVariable(name = "consommableId") Long id
    ) {
        consommableService.delete(id);
        return ResponseEntity.ok("deleted successfully");
    }
}
