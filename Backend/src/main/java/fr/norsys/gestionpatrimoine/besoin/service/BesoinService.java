package fr.norsys.gestionpatrimoine.besoin.service;

import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoRequest;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BesoinService {
    BesoinDtoResponse findBesoinByid(Long id);
    List<BesoinDtoResponse> findAllBesoin();
    BesoinDtoResponse addBesoin(BesoinDtoRequest besoinDtoRequest);
    BesoinDtoResponse updateBesoin(BesoinDtoRequest besoinDtoRequest, Long id);
    void deleteBesoin(Long id);
}
