package fr.norsys.gestionpatrimoine.patrimoine.consommable.dto;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.Consommable}
 */
public record ConsommableDtoResponse(
        Long id,
        String nom,
        String description,
        String marque,
        Long quantite,
        Long agenceId,
        String agence,
        String consommableCategorie
) implements Serializable { }