package fr.norsys.gestionpatrimoine.reparation.service;

import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoRequest;
import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoResponce;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReparationService {
    ReparationDtoResponce findReparationByid(Long id);
    List<ReparationDtoResponce> findAllReparation();
    ReparationDtoResponce addReparation(ReparationDtoRequest reparationDtoRequest);
    ReparationDtoResponce updateReparation(ReparationDtoRequest reparationDtoRequest, Long id);
    void deleteReparation(Long id);
}

