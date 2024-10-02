package fr.norsys.gestionpatrimoine.reparation.controller;

import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoRequest;
import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoResponce;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import fr.norsys.gestionpatrimoine.reparation.service.ReparationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reparations")
@RequiredArgsConstructor
public class ReparationController {
    private final ReparationService reparationService;

    @GetMapping("{id}")
    ResponseEntity<ReparationDtoResponce> getReparationById(@PathVariable Long id) {
        return new ResponseEntity<>(reparationService.findReparationByid(id), HttpStatus.OK);
    }
    @PutMapping("/{id}")
    ResponseEntity<ReparationDtoResponce> updateReparation(@RequestBody ReparationDtoRequest reparation , @PathVariable Long id){
        return new ResponseEntity<>(reparationService.updateReparation(reparation, id), HttpStatus.OK);
    }
    @GetMapping
    ResponseEntity<List<ReparationDtoResponce>> findAll(){
         reparationService.findAllReparation();
         return  new ResponseEntity<>(reparationService.findAllReparation(),HttpStatus.OK);
    }
    @PostMapping
    ResponseEntity<ReparationDtoResponce> createReparation(@RequestBody ReparationDtoRequest reparation ){
        return  new ResponseEntity<>(reparationService.addReparation(reparation),HttpStatus.CREATED);

    }
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteById(@PathVariable Long id ){
        reparationService.deleteReparation(id);
        return ResponseEntity.ok("Deleted with success.");
    }

}