package fr.norsys.gestionpatrimoine.plateau.mapper;

import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoRequest;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoResponse;
import fr.norsys.gestionpatrimoine.plateau.entity.Plateau;

public class PlateauMapper {
    public static Plateau toEntity(PlateauDtoRequest dtoRequest) {
        Plateau plateau = new Plateau();
        plateau.setName(dtoRequest.name());
        plateau.setCapacity(dtoRequest.capacity());
        plateau.setFloor(dtoRequest.floor());
        plateau.setHasKitchen(dtoRequest.hasKitchen());
        plateau.setHasMeetingRoom(dtoRequest.hasMeetingRoom());
        plateau.setHasRestroom(dtoRequest.hasRestroom());


        return plateau;
    }

    public static PlateauDtoResponse toDto(Plateau plateau) {
        return new PlateauDtoResponse(
            plateau.getId(),
                plateau.getName(),
                plateau.getFloor(),
                plateau.getCapacity(),
                plateau.isHasMeetingRoom(),
                plateau.isHasKitchen(),
                plateau.isHasRestroom(),
                plateau.getAgence().getNom()
        );
    }

}
