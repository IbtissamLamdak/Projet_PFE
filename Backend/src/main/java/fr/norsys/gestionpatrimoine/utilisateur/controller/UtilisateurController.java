package fr.norsys.gestionpatrimoine.utilisateur.controller;

import fr.norsys.gestionpatrimoine.utilisateur.dto.*;
import fr.norsys.gestionpatrimoine.utilisateur.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;
    @PostMapping
    public ResponseEntity<UtilisateurDtoResponse> createUtilisateur(@Valid @RequestBody UtilisateurDtoRequest request) {
        UtilisateurDtoResponse response = utilisateurService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{utilisateurId}")
    public ResponseEntity<UtilisateurDtoResponse> getUtilisateurById(@PathVariable(name = "utilisateurId") Long id) {
        UtilisateurDtoResponse response = utilisateurService.getById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping(params = "username")
    public ResponseEntity<UtilisateurDtoResponse> getUtilisateurByUsername(@RequestParam(required = false) String username) {
        UtilisateurDtoResponse response = utilisateurService.getByUsername(username);
        return ResponseEntity.ok(response);
    }

    @GetMapping(params = "email")
    public ResponseEntity<UtilisateurDtoResponse> getUtilisateurByEmail(@RequestParam(required = false) String email) {
        UtilisateurDtoResponse response = utilisateurService.getByEmail(email);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<UtilisateurDtoResponse>> getAllUtilisateurs() {
        List<UtilisateurDtoResponse> responses = utilisateurService.getAll();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUtilisateur(@RequestParam(name = "token", required = true) String token) {
        utilisateurService.verifyUser(token);
        return ResponseEntity.ok("Utilisateur verified successfully");
    }

    @PutMapping("/{utilisateurId}")
    public ResponseEntity<UtilisateurDtoResponse> updateUtilisateur(
            @PathVariable(name = "utilisateurId") Long id, @Valid @RequestBody UtilisateurDtoUpdate request) {
        UtilisateurDtoResponse response = utilisateurService.update(id, request);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/{utilisateurId}/assign-collaborateur")
    public ResponseEntity<String> assignUserToCollaborateur(
            @PathVariable(name = "utilisateurId") Long utilisateurId,
            @Valid @RequestBody AssignCollabDto request) {
        utilisateurService.assignUserToCollaborateur(utilisateurId, request);
        return ResponseEntity.ok("User assigned successfully to collaborateur");
    }
    @PatchMapping("/{utilisateurId}/reset-password")
    public ResponseEntity<String> resetUtilisateurPassword(
            @PathVariable(name = "utilisateurId") Long id, @Valid @RequestBody ResetPasswordDto request) {
        utilisateurService.resetPassword(id, request);
        return ResponseEntity.ok("Changement de mot de passe réussi");
    }
    @DeleteMapping("/{utilisateurId}")
    public ResponseEntity<String> deleteUtilisateur(@PathVariable(name = "utilisateurId") Long id) {
        utilisateurService.delete(id);
        return ResponseEntity.ok("Utilisateur supprimé avec succès");
    }
}
