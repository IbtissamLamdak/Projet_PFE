package fr.norsys.gestionpatrimoine.patrimoine.element.service;

import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.patrimoine.element.dto.*;

import java.util.List;

public interface ElementService {
    ElementDtoResponse create(Long actifId, ElementDtoRequest request);
    MultipleElementDtoResponse createMultiple(Long actifId, MultipleElementDtoRequest request);
    ElementDtoResponse getById(Long actifId, String elementId);
    List<ElementDtoResponse> getAll();
    List<ElementDtoResponse> getAllByActif(Long actifId);
    List<MaintenanceDtoResponce> getAllMaintenceByElement(Long actifId, String elementId);
    ElementDtoResponse update(Long actifId, String elementId, ElementDtoUpdate request);
    void delete(Long actifId, String elementId);

}
