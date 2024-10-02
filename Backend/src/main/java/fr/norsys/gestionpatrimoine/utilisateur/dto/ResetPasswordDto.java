package fr.norsys.gestionpatrimoine.utilisateur.dto;

import fr.norsys.gestionpatrimoine.utilisateur.validation.Password;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResetPasswordDto(
        @NotNull(message = "Mot de passe ne doit pas être nul")
        @NotEmpty(message = "Mot de passe ne doit pas être vide")
        @NotBlank(message = "Mot de passe ne doit pas être vide")
        @Size(min = 6, message = "Mot de passe doit comporter au moins {min} caractères")
        @Password
        String newPassword,
        @NotNull(message = "Mot de passe ne doit pas être nul")
        @NotEmpty(message = "Mot de passe ne doit pas être vide")
        @NotBlank(message = "Mot de passe ne doit pas être vide")
        @Size(min = 6, message = "Mot de passe doit comporter au moins {min} caractères")
        @Password
        String confirmNewPassword
) {
}
