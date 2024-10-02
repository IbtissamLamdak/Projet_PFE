package fr.norsys.gestionpatrimoine.patrimoine.actif.dto;

import jakarta.validation.constraints.*;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif}
 */
public record ActifDtoRequest(
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
        @NotNull(message = "Modele ne doit pas être nul")
        @NotBlank(message = "Modele ne doit pas être vide")
        @NotEmpty(message = "Modele ne doit pas être vide")
        String modele,
        @NotNull(message = "Categorie ne doit pas être nul")
        @NotBlank(message = "Categorie ne doit pas être vide")
        @NotEmpty(message = "Categorie ne doit pas être vide")
        String actifCategorie,
        @NotNull(message = "Agence id ne doit pas être nul")
        Long agenceId,
        Long quantiteDisponible
) implements Serializable {}