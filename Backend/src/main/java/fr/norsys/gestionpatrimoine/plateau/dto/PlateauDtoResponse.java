package fr.norsys.gestionpatrimoine.plateau.dto;

import java.io.Serializable;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.plateau.entity.Plateau}
 */
public record PlateauDtoResponse(long id, String name, int floor, int capacity, boolean hasMeetingRoom,
                                 boolean hasKitchen, boolean hasRestroom, String agenceNom) implements Serializable {
}