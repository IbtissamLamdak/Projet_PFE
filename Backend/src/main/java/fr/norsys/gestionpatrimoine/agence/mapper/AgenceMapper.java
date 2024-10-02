package fr.norsys.gestionpatrimoine.agence.mapper;

import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoRequest;
import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoResponse;
import fr.norsys.gestionpatrimoine.agence.entity.Agence;

public class AgenceMapper {
    public static Agence toEntity(AgenceDtoRequest dtoRequest) {
        Agence agence = new Agence();
        agence.setNom(dtoRequest.nom());
        agence.setAdresse(dtoRequest.adresse());
        agence.setLocalisation(dtoRequest.localisation());
        agence.setVille(dtoRequest.ville());
        agence.setPays(dtoRequest.pays());
        agence.setLatitude(dtoRequest.latitude());
        agence.setLongitude(dtoRequest.longitude());
        agence.setDescription(dtoRequest.description());
        return agence;
    }

    public static AgenceDtoResponse toDto(Agence agence) {
        return new AgenceDtoResponse(
                agence.getId(),
                agence.getNom(),
                agence.getLocalisation(),
                agence.getAdresse(),
                agence.getVille(),
                agence.getPays(),
                agence.getLongitude(),
                agence.getLatitude(),
                agence.getDescription()
        );
    }
}
