package fr.norsys.gestionpatrimoine.besoin.dto;

import fr.norsys.gestionpatrimoine.besoin.enums.BesoinStatus;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.besoin.entity.Besoin}
 */
public record BesoinDtoRequest(
        String description,
        LocalDateTime dateReclamation,
        BesoinStatus status,
        Long quantite,
        Long collaborateurId,
        Long materielId
) implements Serializable { }