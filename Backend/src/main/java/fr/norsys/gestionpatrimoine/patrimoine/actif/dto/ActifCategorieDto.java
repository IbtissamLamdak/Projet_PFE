package fr.norsys.gestionpatrimoine.patrimoine.actif.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.actif.entity.ActifCategorie}
 */
public record ActifCategorieDto(
        Long id,
        @NotNull(message = "Nom ne doit pas être nul")
        @NotBlank(message = "Nom ne doit pas être vide")
        @NotEmpty(message = "Nom ne doit pas être vide")
        String nom
) implements Serializable { }