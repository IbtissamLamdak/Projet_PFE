package fr.norsys.gestionpatrimoine.fournisseur.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur}
 */
public record FournisseurDtoRequest(
        @NotNull(message = "Nom obligatoire ")
        String nom,
        @NotNull(message = "Prenom obligatoire ")
        String prenom,
        @Email
        String email,
        @NotNull(message = "Adresse obligatoire ")
        String adresse,
        @NotNull(message = "Ville obligatoire ")

        String ville,
        @NotNull(message = "Pays obligatoire ")
        String pays,
        @NotNull(message = "Numéro de téléphone obligatoire")
        String tel
) implements Serializable {
}