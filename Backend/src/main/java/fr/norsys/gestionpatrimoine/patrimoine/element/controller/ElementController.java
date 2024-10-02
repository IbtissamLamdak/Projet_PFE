package fr.norsys.gestionpatrimoine.patrimoine.element.controller;

import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.patrimoine.element.dto.*;
import fr.norsys.gestionpatrimoine.patrimoine.element.service.ElementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ElementController {
    private final ElementService elementService;
    @PostMapping("/actifs/{actifId}/elements")
    public ResponseEntity<ElementDtoResponse> createElement(
            @PathVariable(name = "actifId") Long actifId,
            @Valid @RequestBody ElementDtoRequest request) {
        ElementDtoResponse response = elementService.create(actifId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/actifs/{actifId}/elements/multiple")
    public ResponseEntity<MultipleElementDtoResponse> createMultipleElements(
            @PathVariable(name = "actifId") Long actifId,
            @Valid @RequestBody MultipleElementDtoRequest request) {
        MultipleElementDtoResponse response = elementService.createMultiple(actifId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/elements")
    public ResponseEntity<List<ElementDtoResponse>> getAllElement() {
        List<ElementDtoResponse> responses = elementService.getAll();
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/actifs/{actifId}/elements/{elementId}")
    public ResponseEntity<ElementDtoResponse> getElementById(
            @PathVariable(name = "actifId") Long actifId,
            @PathVariable(name = "elementId") String elementId
    ) {
        ElementDtoResponse response = elementService.getById(actifId, elementId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/actifs/{actifId}/elements")
    public ResponseEntity<List<ElementDtoResponse>> getAllElement(
            @PathVariable(name = "actifId") Long actifId
    ) {
        List<ElementDtoResponse> responses;
        if(actifId != null) {
            responses = elementService.getAllByActif(actifId);
        }else {
            responses = elementService.getAll();
        }
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/actifs/{actifId}/elements/{elementId}/maintenances")
    public ResponseEntity<List<MaintenanceDtoResponce>> getAllMaintenaceByElement(
            @PathVariable(name = "actifId") Long actifId,
            @PathVariable(name = "elementId") String elementId) {
        List<MaintenanceDtoResponce> responces = elementService.getAllMaintenceByElement(actifId, elementId);
        return ResponseEntity.ok(responces);
    }
    @PutMapping("/actifs/{actifId}/elements/{elementId}")
    public ResponseEntity<ElementDtoResponse> updateElement(
            @PathVariable(name = "actifId") Long actifId,
            @PathVariable(name = "elementId") String elementId,
            @Valid @RequestBody ElementDtoUpdate request
    ) {
        ElementDtoResponse response = elementService.update(actifId, elementId, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/actifs/{actifId}/elements/{elementId}")
    public ResponseEntity<?> deleteElement(
            @PathVariable(name = "actifId") Long actifId,
            @PathVariable(name = "elementId") String elementId
    ) {
        elementService.delete(actifId, elementId);
        return ResponseEntity.ok("deleted successfully");
    }
}
