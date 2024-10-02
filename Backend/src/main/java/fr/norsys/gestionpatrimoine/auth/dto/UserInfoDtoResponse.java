package fr.norsys.gestionpatrimoine.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import fr.norsys.gestionpatrimoine.auth.enums.Role;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur}
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserInfoDtoResponse(
        String username,
        String email,
        Role role,
        boolean isActif,
        String nom,
        String prenom,
        String telephone,
        String cin,
        String adresse,
        String post,
        String specialite
) implements Serializable { }