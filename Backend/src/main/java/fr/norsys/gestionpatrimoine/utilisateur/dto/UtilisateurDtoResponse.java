package fr.norsys.gestionpatrimoine.utilisateur.dto;

import fr.norsys.gestionpatrimoine.auth.enums.Role;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;

import java.io.Serializable;

/**
 * DTO for {@link Utilisateur}
 */
public record UtilisateurDtoResponse(Long id, String username, String email, boolean isActif, Role role, Long collaborateurId) implements Serializable {
}