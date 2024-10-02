package fr.norsys.gestionpatrimoine.bon.dto;

import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.bon.entity.Bon}
 */
public record BonDtoResponse(
        String numeroBon,
        Long materielId,
        String materiel,
        Double prix,
        Integer quantiteDemande,
        LocalDateTime dateLivraison,
        Long fournisseurId,
        String fournisseur
) implements Serializable {
}
