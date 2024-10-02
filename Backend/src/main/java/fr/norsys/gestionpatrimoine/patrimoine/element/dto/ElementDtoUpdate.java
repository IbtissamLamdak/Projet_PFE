package fr.norsys.gestionpatrimoine.patrimoine.element.dto;

import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element}
 */
public record ElementDtoUpdate(
        @NotNull(message = "Element status ne doit pas être nul")
        ElementStatus status
) implements Serializable { }