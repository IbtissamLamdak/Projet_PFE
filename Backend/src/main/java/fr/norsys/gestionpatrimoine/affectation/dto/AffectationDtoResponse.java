package fr.norsys.gestionpatrimoine.affectation.dto;

import java.time.LocalDateTime;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.affectation.entity.Affectation}
 */
public record AffectationDtoResponse(Long id ,Long collaborateurId, LocalDateTime date_debut, LocalDateTime date_fin,
                                     String NumeroSerie, String AgenceNom , String PlateauNom,String nom , String Prenom , long AgenceID ,long plateau_id)
{
}