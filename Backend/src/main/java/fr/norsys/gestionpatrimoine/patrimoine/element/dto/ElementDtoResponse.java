package fr.norsys.gestionpatrimoine.patrimoine.element.dto;

import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element}
 */
public record ElementDtoResponse(
        String numeroSerie,
        ElementStatus status,
        Long actifId,
        String actifNom,
        String numeroBon,
        LocalDateTime bonDatePrise
) implements Serializable {}