package fr.norsys.gestionpatrimoine.affectation.service;

import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoRequest;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoResponse;
import fr.norsys.gestionpatrimoine.affectation.entity.Affectation;
import fr.norsys.gestionpatrimoine.affectation.mapper.AffectationMapper;
import fr.norsys.gestionpatrimoine.affectation.repository.AffectationRepository;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.collaborateur.repository.CollaborateurRepository;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import fr.norsys.gestionpatrimoine.patrimoine.element.repository.ElementRepository;
import fr.norsys.gestionpatrimoine.plateau.entity.Plateau;
import fr.norsys.gestionpatrimoine.plateau.repository.PlateauRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffectationServiceImp implements AffectationService {
    private final AffectationRepository affectationRepository;
    private final ElementRepository elementRepository;
    private final CollaborateurRepository collaborateurRepository;
    private final PlateauRepository plateauRepository ;


    @Transactional
    @Override
    public AffectationDtoResponse create(AffectationDtoRequest request) {
        // get element from database
        Element element = getElementByNumeroSerie(request.NumeroSerie());
        Collaborateur collaborateur = getCollaborateurByCollaborateurID(request.collaborateurId());
        Plateau plateau =getPlateauByPlateauID(request.plateau_id());

        if (element.getStatus() != ElementStatus.DISPONIBLE) {
            // Handle the situation where the element status is not DISPONIBLE
             //For example, you can throw an exception or return an error response
            throw new AppException(HttpStatus.BAD_REQUEST, "Element is not available for assignment.");
        }

        // Step 1: Convert DTO to Entity using Mapper
        Affectation affectation = AffectationMapper.toEntity(request);

        affectation.setElement(element);
        affectation.setCollaborateur(collaborateur);
        affectation.setPlateau(plateau);

        element.setStatus(ElementStatus.ATTRIBUÉ);

        // Step 2: Save the new Affectation entity

        Affectation savedAffectation = affectationRepository.save(affectation);

        elementRepository.save(element);

        // Step 3: Convert the saved Entity to DTO
        return AffectationMapper.toDto(savedAffectation);
    }

    @Override
    public AffectationDtoResponse getById(Long id) {
        // Step 1: Retrieve Affectation entity from the repository by ID
        Affectation affectation = getAffectationById(id);

        // Step 2: Convert the retrieved Entity to DTO
        return AffectationMapper.toDto(affectation);
    }
    @Override
    public List<AffectationDtoResponse> getAll() {
        // Step 1: Retrieve all Affectation entities from the repository
        List<Affectation> affectations = affectationRepository.findAll();

        // Step 2: Convert the list of Entities to a list of DTOs
        return affectations.stream()
                .map(AffectationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override

    public AffectationDtoResponse update(Long id, AffectationDtoRequest request) {
        // Step 1: Retrieve Affectation entity from the repository by ID
        Affectation affectation = getAffectationById(id);

        Plateau plateau =getPlateauByPlateauID(request.plateau_id());



        // Step 2: Update properties of the retrieved Entity based on the request
        updateAffectationProperties(affectation, request);
        affectation.setPlateau(plateau);

        // Step 3: Save the updated Entity
        Affectation updatedAffectation = affectationRepository.save(affectation);

        // Step 4: Convert the updated Entity to DTO
        return AffectationMapper.toDto(updatedAffectation);
    }

    @Override
    public void delete(Long id) {
        // Step 1: Retrieve Affectation entity from the repository by ID
        Affectation affectation = getAffectationById(id);
        Element element = affectation.getElement();
        element.setStatus(ElementStatus.DISPONIBLE);
        elementRepository.save(element);
        // Step 2: Delete the retrieved Entity
        affectationRepository.delete(affectation);
    }

    // Helper method: Retrieve Affectation entity by ID from the repository
    private Affectation getAffectationById(Long id) {
        return affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation", "id", id.toString()));
    }

    // Helper method: Update properties of an Affectation entity based on the request
    private void updateAffectationProperties(Affectation affectation, AffectationDtoRequest request) {
        affectation.setDate_debut(request.date_debut());
        affectation.setDate_fin(request.date_fin());
    }

    private Element getElementByNumeroSerie(String numeroSerie) {
        return elementRepository.findById(numeroSerie)
                .orElseThrow(() -> new ResourceNotFoundException("Element", "numeroSerie", numeroSerie));

    }
    private Collaborateur getCollaborateurByCollaborateurID(Long CollaborateurId) {
        return  collaborateurRepository.findById(CollaborateurId).orElseThrow(() ->
                new ResourceNotFoundException("Collaborateur", "CollaborateurId", CollaborateurId.toString()));
    }
    private Plateau getPlateauByPlateauID(Long PlateauID) {
        return  plateauRepository.findById(PlateauID).orElseThrow(() ->
                new ResourceNotFoundException("Plateau", "PlateauId", PlateauID.toString()));
    }
}