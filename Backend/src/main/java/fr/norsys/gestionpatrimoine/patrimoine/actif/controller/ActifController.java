package fr.norsys.gestionpatrimoine.patrimoine.actif.controller;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.actif.service.ActifService;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/actifs")
public class ActifController {
    private final ActifService actifService;
    @PostMapping
    public ResponseEntity<ActifDtoResponse> createActif(
            @Valid @RequestBody ActifDtoRequest request) {
        ActifDtoResponse response = actifService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{actifId}")
    public ResponseEntity<ActifDtoResponse> getActifById(
            @PathVariable(name = "actifId") Long id
    ) {
        ActifDtoResponse response = actifService.getById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<ActifDtoResponse>> getAllActif() {
        List<ActifDtoResponse> responses = actifService.getAll();
        return ResponseEntity.ok(responses);
    }
    @PutMapping("/{actifId}")
    public ResponseEntity<ActifDtoResponse> updateActif(
            @PathVariable(name = "actifId") Long id, @Valid @RequestBody ActifDtoRequest request
    ) {
        ActifDtoResponse response = actifService.update(id, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{actifId}")
    public ResponseEntity<?> deleteActif(
            @PathVariable(name = "actifId") Long id
    ) {
        actifService.delete(id);
        return ResponseEntity.ok("deleted successfully");
    }
}
