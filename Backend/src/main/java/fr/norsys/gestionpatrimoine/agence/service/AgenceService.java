package fr.norsys.gestionpatrimoine.agence.service;

import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoRequest;
import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoResponse;
import fr.norsys.gestionpatrimoine.agence.entity.Agence;

import java.util.List;

public interface AgenceService {
    AgenceDtoResponse findAgenceByid(long id);
    List<AgenceDtoResponse> findAllAgence();
    AgenceDtoResponse addAgence(AgenceDtoRequest dto);
    AgenceDtoResponse updateAgence(AgenceDtoRequest dto,long id);
    void deleteAgence(long id);
}
