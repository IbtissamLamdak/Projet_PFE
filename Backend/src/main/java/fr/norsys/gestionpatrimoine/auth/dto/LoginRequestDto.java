package fr.norsys.gestionpatrimoine.auth.dto;

import jakarta.validation.constraints.*;

public record LoginRequestDto(
    @NotNull(message = "Username ne doit pas être nul")
    @NotBlank(message = "Username ne doit pas être vide")
    @NotEmpty(message = "Username ne doit pas être vide")
    String username,
    @NotNull(message = "Mot de passe ne doit pas être nul")
    @NotEmpty(message = "Mot de passe ne doit pas être vide")
    @NotBlank(message = "Mot de passe ne doit pas être vide")
    String password
) {
}
