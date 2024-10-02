package fr.norsys.gestionpatrimoine.patrimoine.actif.dto;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif}
 */
public record ActifDtoResponse(
        Long id,
        String nom,
        String description,
        String marque,
        Long quantite,
        String agence,
        Long quantiteDisponible,
        String actifCategorie,
        String modele) implements Serializable {}