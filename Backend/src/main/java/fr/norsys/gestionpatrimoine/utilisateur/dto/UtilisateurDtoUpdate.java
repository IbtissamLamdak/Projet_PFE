package fr.norsys.gestionpatrimoine.utilisateur.dto;

import fr.norsys.gestionpatrimoine.auth.enums.Role;
import jakarta.validation.constraints.*;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur}
 */
public record UtilisateurDtoUpdate(
        @NotNull(message = "Username ne doit pas être nul")
        @NotBlank(message = "Username ne doit pas être vide")
        @NotEmpty(message = "Username ne doit pas être vide")
        @Size(min = 4, message = "Username doit comporter au moins {min} caractères")
        String username,
        @NotNull(message = "Email ne doit pas être nul")
        @NotBlank(message = "Email ne doit pas être vide")
        @NotEmpty(message = "Email ne doit pas être vide")
        @Email(message = "Email doit être valide")
        String email,
       boolean isActif,
        @NotNull(message = "Role ne doit pas être nul")
        Role role
) implements Serializable { }