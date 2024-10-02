package fr.norsys.gestionpatrimoine.utilisateur.mapper;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.utilisateur.dto.UtilisateurDtoRequest;
import fr.norsys.gestionpatrimoine.utilisateur.dto.UtilisateurDtoResponse;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;

public class UtilisateurMapper {
    public static Utilisateur toEntity(UtilisateurDtoRequest dto) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(dto.email());
        utilisateur.setUsername(dto.username());
        utilisateur.setPassword(dto.password());
        utilisateur.setRole(dto.role());
        return utilisateur;
    }
    public static UtilisateurDtoResponse toDto(Utilisateur utilisateur) {
        Collaborateur collaborateur = utilisateur.getCollaborateur();
        Long collaborateurId = collaborateur != null ? collaborateur.getId() : null;

        return new UtilisateurDtoResponse(
                utilisateur.getId(),
                utilisateur.getUsername(),
                utilisateur.getEmail(),
                utilisateur.isActif(),
                utilisateur.getRole(),
                collaborateurId
        );
    }
}
