package fr.norsys.gestionpatrimoine.fournisseur.dto;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur}
 */
public record FournisseurDtoResponse(Long id, String nom, String prenom, String email, String adresse, String ville,
                                     String pays, String tel) implements Serializable {
}