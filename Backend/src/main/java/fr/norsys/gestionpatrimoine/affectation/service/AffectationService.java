package fr.norsys.gestionpatrimoine.affectation.service;

import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoRequest;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoResponse;

import java.util.List;

public interface AffectationService {
    AffectationDtoResponse create(AffectationDtoRequest request);

    AffectationDtoResponse getById(Long id);
    List<AffectationDtoResponse> getAll();

    AffectationDtoResponse update(Long id, AffectationDtoRequest request);

    void delete(Long id);
}
