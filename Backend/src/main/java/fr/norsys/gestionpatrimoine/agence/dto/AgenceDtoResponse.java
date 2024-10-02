package fr.norsys.gestionpatrimoine.agence.dto;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.agence.entity.Agence}
 */
public record AgenceDtoResponse(Long id, String nom, String localisation, String adresse, String ville, String pays,
                                double longitude, double latitude, String description) implements Serializable {
}