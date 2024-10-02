package fr.norsys.gestionpatrimoine.patrimoine.actif.service;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifCategorieDto;

import java.util.List;

public interface ActifCategorieService {
    ActifCategorieDto create(ActifCategorieDto request);
    ActifCategorieDto getById(Long id);
    List<ActifCategorieDto> getAll();
    ActifCategorieDto update(Long id, ActifCategorieDto request);
    void delete(Long id);
}
