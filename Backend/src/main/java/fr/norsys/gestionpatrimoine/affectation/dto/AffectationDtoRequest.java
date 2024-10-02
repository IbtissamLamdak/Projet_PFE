package fr.norsys.gestionpatrimoine.affectation.dto;

import java.time.LocalDateTime;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.affectation.entity.Affectation}
 */
public record AffectationDtoRequest(LocalDateTime date_debut, LocalDateTime date_fin, String NumeroSerie ,
                                    Long plateau_id, Long collaborateurId) {
}