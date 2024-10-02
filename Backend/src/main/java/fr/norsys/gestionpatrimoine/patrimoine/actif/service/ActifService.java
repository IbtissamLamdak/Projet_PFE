package fr.norsys.gestionpatrimoine.patrimoine.actif.service;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoResponse;

import java.util.List;

public interface ActifService {
    ActifDtoResponse create(ActifDtoRequest request);
    ActifDtoResponse getById(Long id);
    List<ActifDtoResponse> getAll();
    ActifDtoResponse update(Long id, ActifDtoRequest request);
    void delete(Long id);
}
