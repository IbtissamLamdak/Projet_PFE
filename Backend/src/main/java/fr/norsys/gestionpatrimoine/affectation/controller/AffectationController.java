package fr.norsys.gestionpatrimoine.affectation.controller;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoRequest;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoResponse;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoResponse;
import fr.norsys.gestionpatrimoine.affectation.service.AffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
public class AffectationController {
    private final AffectationService affectationService;


    @GetMapping("{id}")
    ResponseEntity<AffectationDtoResponse> getAffectationById(@PathVariable Long id) {
        return new ResponseEntity<>(affectationService.getById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    ResponseEntity<AffectationDtoResponse> updateAffectation(@RequestBody AffectationDtoRequest affectation , @PathVariable Long id){
        return new ResponseEntity<>(affectationService.update(id, affectation), HttpStatus.OK);
    }
    @GetMapping
    ResponseEntity<List<AffectationDtoResponse>> findAll(){
        return  new ResponseEntity<>(affectationService.getAll(),HttpStatus.OK);
    }
    @PostMapping
    ResponseEntity<AffectationDtoResponse> createAffectation(@RequestBody AffectationDtoRequest affectation ){
        return  new ResponseEntity<>(affectationService.create(affectation),HttpStatus.CREATED);

    }
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteById(@PathVariable Long id ){
        affectationService.delete(id);
        return ResponseEntity.ok("Deleted with success.");
    }

}