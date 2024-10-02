package fr.norsys.gestionpatrimoine.collaborateur.dto;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link Collaborateur}
 */
public record CollaborateurDtoResponse(
        Long id,
        String CIN,
        String nom,
        String prenom,
        LocalDate dateEmbauche,
        String poste,
        String specialite,
        String email,
        String telephone,
        String adresse,
        String agence,
        Long agenceId
) implements Serializable { }