package fr.norsys.gestionpatrimoine.patrimoine.element.dto;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element}
 */
public record MultipleElementDtoResponse(
        List<ElementDtoResponse> elements
) implements Serializable { }