package fr.norsys.gestionpatrimoine.agence.dto;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link Agence}
 */
public record AgenceDtoRequest(@NotNull String nom, String localisation, String adresse, String ville, String pays,
                               double longitude, double latitude, String description) implements Serializable {
}