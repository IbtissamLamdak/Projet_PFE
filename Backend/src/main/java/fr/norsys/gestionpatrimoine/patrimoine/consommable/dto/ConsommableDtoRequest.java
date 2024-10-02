package fr.norsys.gestionpatrimoine.patrimoine.consommable.dto;

import jakarta.validation.constraints.*;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.Consommable}
 */
public record ConsommableDtoRequest(
        @NotNull(message = "Nom ne doit pas être nul")
        @NotBlank(message = "Nom ne doit pas être vide")
        @NotEmpty(message = "Nom ne doit pas être vide")
        String nom,
        @NotNull(message = "Description ne doit pas être nul")
        @NotBlank(message = "Description ne doit pas être vide")
        @NotEmpty(message = "Description ne doit pas être vide")
        @Size(min = 5, message = "Description doit comporter au moins {min} caractères")
        String description,
        @NotNull(message = "Marque ne doit pas être nul")
        @NotBlank(message = "Marque ne doit pas être vide")
        @NotEmpty(message = "Marque ne doit pas être vide")
        String marque,
        @PositiveOrZero(message = "la quantité doit être supérieure ou égale à zéro")
        Long quantite,
        @NotNull(message = "Agence id ne doit pas être nul")
        Long agenceId,
        @NotNull(message = "Categorie ne doit pas être nul")
        @NotBlank(message = "Categorie ne doit pas être vide")
        @NotEmpty(message = "Categorie ne doit pas être vide")
        String consommableCategorie
) implements Serializable {}