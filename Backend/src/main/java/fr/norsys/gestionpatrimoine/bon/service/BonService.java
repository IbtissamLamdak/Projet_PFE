package fr.norsys.gestionpatrimoine.bon.service;

import fr.norsys.gestionpatrimoine.bon.dto.BonDtoRequest;
import fr.norsys.gestionpatrimoine.bon.dto.BonDtoResponse;
import fr.norsys.gestionpatrimoine.bon.entity.Bon;

import java.util.List;

public interface BonService {
    BonDtoResponse findBonById(String id);
    List<BonDtoResponse> findAllBons();
    BonDtoResponse addBon(BonDtoRequest bon);
    BonDtoResponse updateBon(String id,BonDtoRequest bon);
    void deleteBon(String id);
}
