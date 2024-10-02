package fr.norsys.gestionpatrimoine.agence.controller;

import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoRequest;
import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoResponse;
import fr.norsys.gestionpatrimoine.agence.service.AgenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/agences")
@RequiredArgsConstructor
public class AgenceController {
    private final AgenceService agenceService;
    @GetMapping("/{id}")
    ResponseEntity<AgenceDtoResponse> findById(@PathVariable long id){
        return ResponseEntity.ok(agenceService.findAgenceByid(id));
    }
    @PutMapping("/{id}")
    ResponseEntity<AgenceDtoResponse> updateAgence(@RequestBody AgenceDtoRequest request, @PathVariable long id){
        AgenceDtoResponse response = agenceService.updateAgence(request, id);
        return ResponseEntity.ok(response);    }
    @GetMapping
    ResponseEntity<List<AgenceDtoResponse>> findAll(){
        List<AgenceDtoResponse> responses = agenceService.findAllAgence();
        return new ResponseEntity<>(responses, HttpStatus.OK);    }
    @PostMapping
    ResponseEntity<AgenceDtoResponse> add(@RequestBody AgenceDtoRequest request){
        return ResponseEntity.ok(agenceService.addAgence(request));
    }
  @DeleteMapping("/{id}")
  ResponseEntity<String> deleteById(@PathVariable long id){
      agenceService.deleteAgence(id);
      return ResponseEntity.ok("Agence deleted successfully");
  }
}
