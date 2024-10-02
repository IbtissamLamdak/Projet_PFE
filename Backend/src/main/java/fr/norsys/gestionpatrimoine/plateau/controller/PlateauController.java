package fr.norsys.gestionpatrimoine.plateau.controller;

import fr.norsys.gestionpatrimoine.agence.service.AgenceService;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoRequest;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoResponse;
import fr.norsys.gestionpatrimoine.plateau.service.PlateauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("api")
public class PlateauController {
    @Autowired
    private PlateauService platteauService;

    @GetMapping("/plateaux/{id}")
    ResponseEntity<PlateauDtoResponse> findById(@PathVariable long id){
        return ResponseEntity.ok(platteauService.findPlateauByid(id));
    }
    @PutMapping("/plateaux/{id}")
    ResponseEntity<PlateauDtoResponse> updatePlateau(@RequestBody PlateauDtoRequest request,@PathVariable long id){
        PlateauDtoResponse response = platteauService.updatePlateau(request, id);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/plateaux")
    ResponseEntity<List<PlateauDtoResponse>> findAll(){
        List<PlateauDtoResponse> responses = platteauService.findAllPlateau();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
    @PostMapping("/agences/{id}/plateaux")
    ResponseEntity<PlateauDtoResponse> addPlateauToAgence(
            @RequestBody PlateauDtoRequest request,
            @PathVariable long id){
        PlateauDtoResponse response = platteauService.addPlateau(request, id);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/plateaux/{id}")
    ResponseEntity<String> deleteById(@PathVariable long id){
        platteauService.deletePlateau(id);
        return ResponseEntity.ok("Plateau deleted successfully");
    }
    @GetMapping("/agences/{id}/plateaux")
    ResponseEntity<List<PlateauDtoResponse>> getAllPlateauxByAgence(@PathVariable long id){
        List<PlateauDtoResponse> responses = platteauService.findPlateauByAgenceId(id);
        return ResponseEntity.ok(responses);
    }
}
