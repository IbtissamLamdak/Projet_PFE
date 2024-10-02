package fr.norsys.gestionpatrimoine.collaborateur.controller;

import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoRequest;
import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoResponse;
import fr.norsys.gestionpatrimoine.collaborateur.service.CollaborateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("api/collaborateurs")
public class CollaborateurController {
    @Autowired
    private CollaborateurService collaborateurService;
    @GetMapping("/{id}")
    ResponseEntity<CollaborateurDtoResponse> findById(@PathVariable long id){
        return ResponseEntity.ok(collaborateurService.findCollaborateurByid(id));
    }
    @PutMapping("/{id}")
    ResponseEntity<CollaborateurDtoResponse> updateCollaborateur(@RequestBody CollaborateurDtoRequest request, @PathVariable long id){
        CollaborateurDtoResponse response = collaborateurService.updateCollaborateur(request, id);
        return ResponseEntity.ok(response);    }
    @GetMapping
    ResponseEntity<List<CollaborateurDtoResponse>> findAll(){
        List<CollaborateurDtoResponse> responses = collaborateurService.findAllCollaborateur();
        return new ResponseEntity<>(responses, HttpStatus.OK);    }
    @PostMapping
    ResponseEntity<CollaborateurDtoResponse> add(@RequestBody CollaborateurDtoRequest request){
        return ResponseEntity.ok(collaborateurService.addCollaborateur(request));
    }
  @DeleteMapping("/{id}")
  ResponseEntity<String> deleteById(@PathVariable long id){
      collaborateurService.deleteCollaborateur(id);
      return ResponseEntity.ok("Collaborateurs deleted successfully");
  }
}
