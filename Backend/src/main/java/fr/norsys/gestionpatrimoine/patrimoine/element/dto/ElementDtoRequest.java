package fr.norsys.gestionpatrimoine.patrimoine.element.dto;

import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element}
 */
public record ElementDtoRequest(
        @NotNull(message = "Numero serie ne doit pas être nul")
        @NotBlank(message = "Numero serie ne doit pas être vide")
        @NotEmpty(message = "Numero serie ne doit pas être vide")
        String numeroSerie,
        @NotNull(message = "Element status ne doit pas être nul")
        ElementStatus status,
        @NotNull(message = "Numero de bon ne doit pas être nul")
        @NotBlank(message = "Numero de bon ne doit pas être vide")
        @NotEmpty(message = "Numero de bon ne doit pas être vide")
        String bonNumero
) implements Serializable {}