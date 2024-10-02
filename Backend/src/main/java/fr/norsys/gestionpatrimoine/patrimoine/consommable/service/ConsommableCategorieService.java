package fr.norsys.gestionpatrimoine.patrimoine.consommable.service;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableCategorieDto;

import java.util.List;

public interface ConsommableCategorieService {
    ConsommableCategorieDto create(ConsommableCategorieDto request);
    ConsommableCategorieDto getById(Long id);
    List<ConsommableCategorieDto> getAll();
    ConsommableCategorieDto update(Long id, ConsommableCategorieDto request);
    void delete(Long id);
}
