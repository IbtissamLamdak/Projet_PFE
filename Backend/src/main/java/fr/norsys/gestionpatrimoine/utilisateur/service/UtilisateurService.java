package fr.norsys.gestionpatrimoine.utilisateur.service;

import fr.norsys.gestionpatrimoine.utilisateur.dto.*;

import java.util.List;

public interface UtilisateurService {
    UtilisateurDtoResponse create(UtilisateurDtoRequest request);
    void verifyUser(String token);
    UtilisateurDtoResponse update(Long utilisateurId, UtilisateurDtoUpdate request);
    UtilisateurDtoResponse getById(Long id);
    UtilisateurDtoResponse getByUsername(String username);
    UtilisateurDtoResponse getByEmail(String email);
    List<UtilisateurDtoResponse> getAll();
    void delete(Long utilisateurId);
    void resetPassword(Long id, ResetPasswordDto request);
    void assignUserToCollaborateur(Long utilisateurId, AssignCollabDto request);
}
