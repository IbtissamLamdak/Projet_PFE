package fr.norsys.gestionpatrimoine.patrimoine.element.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element}
 */
public record MultipleElementDtoRequest(
        @NotNull(message = "La liste des éléments ne doit pas être nulle")
        @Size(min = 1, message = "La liste des éléments doit avoir au moins {min} éléments")
        List<ElementDtoRequest> elements
) implements Serializable {
}