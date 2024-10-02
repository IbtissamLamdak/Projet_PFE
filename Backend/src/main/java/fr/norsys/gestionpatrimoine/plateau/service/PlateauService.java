package fr.norsys.gestionpatrimoine.plateau.service;

import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoRequest;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoResponse;

import java.util.List;

public interface PlateauService {
    PlateauDtoResponse findPlateauByid(long id);
    List<PlateauDtoResponse> findAllPlateau();
    PlateauDtoResponse addPlateau(PlateauDtoRequest dto, long agenceId);
    PlateauDtoResponse updatePlateau(PlateauDtoRequest dto,long id);
    void deletePlateau(long id);
    List<PlateauDtoResponse> findPlateauByAgenceId(long id);
}
