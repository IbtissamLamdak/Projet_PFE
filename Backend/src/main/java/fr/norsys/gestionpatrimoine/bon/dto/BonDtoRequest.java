package fr.norsys.gestionpatrimoine.bon.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.bon.entity.Bon}
 */
public record BonDtoRequest(
        @NotNull(message = "Numéro de bon obligatoire ")
        String numeroBon,
        @NotNull(message = "Materiel id obligatoire ")
        Long materielId,
        @NotNull(message = "Numéro de bon obligatoire ")
        Double prix,
        @NotNull(message = " Quantité demandée obligatoire ")
        @Positive(message = "Quantité toujours positive")
        Integer quantiteDemande,
        @NotNull(message = "Date Livraison obligatoire")
        LocalDateTime dateLivraison,
        @NotNull(message = " fournisseur obligatoire")
        Long fournisseurId
) implements Serializable {
}
