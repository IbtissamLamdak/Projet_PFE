package fr.norsys.gestionpatrimoine.patrimoine.consommable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.ConsommableCategorie}
 */
public record ConsommableCategorieDto(
        Long id,
        @NotNull(message = "Nom ne doit pas être nul")
        @NotBlank(message = "Nom ne doit pas être vide")
        @NotEmpty(message = "Nom ne doit pas être vide")
        String nom
) implements Serializable {
}