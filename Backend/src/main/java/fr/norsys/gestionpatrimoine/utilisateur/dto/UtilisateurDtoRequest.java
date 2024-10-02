package fr.norsys.gestionpatrimoine.utilisateur.dto;

import fr.norsys.gestionpatrimoine.auth.enums.Role;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import fr.norsys.gestionpatrimoine.utilisateur.validation.Password;
import jakarta.validation.constraints.*;

import java.io.Serializable;

/**
 * DTO for {@link Utilisateur}
 */
public record UtilisateurDtoRequest(
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
        @NotNull(message = "Mot de passe ne doit pas être nul")
        @NotEmpty(message = "Mot de passe ne doit pas être vide")
        @NotBlank(message = "Mot de passe ne doit pas être vide")
        @Size(min = 6, message = "Mot de passe doit comporter au moins {min} caractères")
        @Password
        String password,
        @NotNull(message = "Role ne doit pas être nul")
        Role role
) implements Serializable {
}