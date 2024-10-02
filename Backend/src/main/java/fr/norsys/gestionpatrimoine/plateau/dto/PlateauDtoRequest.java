package fr.norsys.gestionpatrimoine.plateau.dto;

public record PlateauDtoRequest(

    String name,
    int floor,
    int capacity,
    boolean hasMeetingRoom,
    boolean hasKitchen,
    boolean hasRestroom,
    Long agenceId) {
}
