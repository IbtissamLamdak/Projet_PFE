package fr.norsys.gestionpatrimoine.patrimoine.element.service.impl;

import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import fr.norsys.gestionpatrimoine.bon.repository.BonRepository;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.maintenance.mapper.MaintenanceMapper;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif;
import fr.norsys.gestionpatrimoine.patrimoine.actif.repository.ActifRepository;
import fr.norsys.gestionpatrimoine.patrimoine.actif.service.impl.ActifServiceImpl;
import fr.norsys.gestionpatrimoine.patrimoine.element.dto.*;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import fr.norsys.gestionpatrimoine.patrimoine.element.mapper.ElementMapper;
import fr.norsys.gestionpatrimoine.patrimoine.element.repository.ElementRepository;
import fr.norsys.gestionpatrimoine.patrimoine.element.service.ElementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElementServiceImpl implements ElementService {
    private final ElementRepository elementRepository;
    private final ActifRepository actifRepository;
    private final BonRepository bonRepository;
    @Override
    public ElementDtoResponse create(Long actifId, ElementDtoRequest request) {
        // dto to entity
        Element element = ElementMapper.INSTANCE.toEntity(request);

        // check if numero serie already exist
        checkIfNumeroSerieExist(request.numeroSerie());

        // check if quantite condition
        checkQuantiteDisponibility(actifId, request.bonNumero());

        // add actif and bon to element
        addActifToElement(actifId, element);
        addBonToElement(request.bonNumero(), element);

        // save element in database
        Element savedElement = elementRepository.save(element);

        // entity to dto
        return ElementMapper.INSTANCE.toDto(savedElement);
    }
    @Override
    public MultipleElementDtoResponse createMultiple(Long actifId, MultipleElementDtoRequest request) {
        if(request.elements() == null || request.elements().isEmpty())
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid request");

        List<ElementDtoResponse> responses = new ArrayList<>();

        request.elements().forEach(element -> {
            ElementDtoResponse dtoResponse = this.create(actifId, element);
            responses.add(dtoResponse);
        });

        return new MultipleElementDtoResponse(responses);
    }
    @Override
    public ElementDtoResponse getById(Long actifId, String elementId) {
        // check if element of actif material
        Element element = isElementAssociatedWithMateriel(actifId, elementId);

        return ElementMapper.INSTANCE.toDto(element);
    }
    @Override
    public List<ElementDtoResponse> getAll() {
        return elementRepository.findAll().stream()
                .map(ElementMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<ElementDtoResponse> getAllByActif(Long actifId) {
        // get actif from database
        Actif actif = getActifById(actifId);

        // get list of elements
        Set<Element> elements = actif.getElements();

        if(elements == null)
            return Collections.emptyList();

        return elements.stream()
                .map(ElementMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<MaintenanceDtoResponce> getAllMaintenceByElement(Long actifId, String elementId) {
        // check if element of actif material
        Element element = isElementAssociatedWithMateriel(actifId, elementId);

        // get list of maintenance
        Set<Maintenance> maintenances = element.getMaintenance();

        if(maintenances == null)
            return Collections.emptyList();

        return maintenances.stream()
                .map(MaintenanceMapper::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public ElementDtoResponse update(Long actifId, String elementId, ElementDtoUpdate request) {
        // check if element of actif material
        Element element = isElementAssociatedWithMateriel(actifId, elementId);

        // update element
        element.setStatus(request.status());

        // save update in database
        Element updatedElement = elementRepository.save(element);

        return ElementMapper.INSTANCE.toDto(updatedElement);
    }
    @Override
    public void delete(Long actifId, String elementId) {
        // check if element of actif material
        Element element = isElementAssociatedWithMateriel(actifId, elementId);

        elementRepository.delete(element);
    }
    private Actif getActifById(Long actifId) {
        return actifRepository.findById(actifId).orElseThrow(
                () -> new ResourceNotFoundException("Actif", "id", actifId.toString())
        );
    }
    private Element getElementById(String elementId) {
        return elementRepository.findById(elementId).orElseThrow(
                () -> new ResourceNotFoundException("Element", "id", elementId)
        );
    }
    private Bon getBonById(String bonId) {
        return bonRepository.findById(bonId).orElseThrow(
                () -> new ResourceNotFoundException("Bon", "id", bonId)
        );
    }
    private Element isElementAssociatedWithMateriel(Long actifId, String elementId) {
        Actif actif = getActifById(actifId);
        Element element = getElementById(elementId);

        if(element.getActif().getId().equals(actif.getId()) && element.getActif().getNom().equals(actif.getNom()))
            return element;

        throw new AppException(HttpStatus.BAD_REQUEST, "Element is not associated with Actif");
    }
    private void addActifToElement(Long actifId, Element element) {
        // get actif from database
        Actif actif = getActifById(actifId);

        // add actif to element
        element.setActif(actif);
    }
    private void addBonToElement(String bonId, Element element) {
        // get bon from database
        Bon bon = getBonById(bonId);

        // add bon to element
        element.setBon(bon);
    }
    private void checkIfNumeroSerieExist(String numeroSerie) {
        if(elementRepository.existsByNumeroSerie(numeroSerie)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Numero serie already exist");
        }
    }
    private void checkQuantiteDisponibility(Long actifId, String bonNumber) {
        Bon bon = getBonById(bonNumber);
        Long numberOfElements = elementRepository.countElementByActifAndBon(actifId, bonNumber);
        if(bon.getQuantiteDemande() <= numberOfElements)
            throw new AppException(HttpStatus.BAD_REQUEST, "Can't create element");
    }
}
