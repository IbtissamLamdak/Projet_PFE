package fr.norsys.gestionpatrimoine.patrimoine.consommable.service;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoResponse;

import java.util.List;

public interface ConsommableService {
    ConsommableDtoResponse create(ConsommableDtoRequest request);
    ConsommableDtoResponse getById(Long id);
    List<ConsommableDtoResponse> getAll();
    ConsommableDtoResponse update(Long id, ConsommableDtoRequest request);
    void delete(Long id);
}
