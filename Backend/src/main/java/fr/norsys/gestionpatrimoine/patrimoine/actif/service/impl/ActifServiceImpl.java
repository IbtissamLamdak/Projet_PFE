package fr.norsys.gestionpatrimoine.patrimoine.actif.service.impl;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.agence.repository.AgenceRepository;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.ActifCategorie;
import fr.norsys.gestionpatrimoine.patrimoine.actif.mapper.ActifMapper;
import fr.norsys.gestionpatrimoine.patrimoine.actif.repository.ActifCategorieRepository;
import fr.norsys.gestionpatrimoine.patrimoine.actif.repository.ActifRepository;
import fr.norsys.gestionpatrimoine.patrimoine.actif.service.ActifService;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import fr.norsys.gestionpatrimoine.patrimoine.element.repository.ElementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActifServiceImpl implements ActifService {
    private final ActifRepository actifRepository;
    private final AgenceRepository agenceRepository;
    private final ActifCategorieRepository actifCategorieRepository;
    private final ElementRepository elementRepository;
    @Override
    public ActifDtoResponse create(ActifDtoRequest request) {
        // dto to entity
        Actif actif = ActifMapper.INSTANCE.toEntity(request);

        actif.setQuantiteDisponible(request.quantite());

        // add agence and categorie to actif
        addAgenceToActif(request.agenceId(), actif);
        addCategorieToActif(request.actifCategorie(), actif);

        // save actif in database
        Actif savedActif = actifRepository.save(actif);

        return ActifMapper.INSTANCE.toDto(savedActif);
    }
    @Override
    public ActifDtoResponse getById(Long id) {
        // get actif from database
        Actif actif = getActifById(id);
        return ActifMapper.INSTANCE.toDto(actif);
    }
    @Override
    public List<ActifDtoResponse> getAll() {
        return actifRepository.findAll().stream()
                .map(actif -> getById(actif.getId()))
                .collect(Collectors.toList());
    }
    @Override
    public ActifDtoResponse update(Long id, ActifDtoRequest request) {
        // get actif from database
        Actif actif = getActifById(id);

        // update actif
        actif.setNom(request.nom());
        actif.setDescription(request.description());
        actif.setMarque(request.marque());
        actif.setQuantite(request.quantite());
        actif.setQuantiteDisponible(request.quantiteDisponible());
        actif.setModele(request.modele());

        addAgenceToActif(request.agenceId(), actif);
        addCategorieToActif(request.actifCategorie(), actif);

        // save update in database
        Actif updatedActif = actifRepository.save(actif);

        return ActifMapper.INSTANCE.toDto(updatedActif);
    }
    @Override
    public void delete(Long id) {
        // get actif from database
        Actif actif = getActifById(id);

        actifRepository.delete(actif);
    }
    public Actif getActifById(Long id) {
        Actif actif = actifRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Actif", "id", id.toString())
        );
        actif.setQuantiteDisponible(getDisponibleQuantite(actif));
        return actif;
    }
    private Agence getAgenceById(Long agenceId) {
        // get agence from database
        return agenceRepository.findById(agenceId).orElseThrow(
                () -> new ResourceNotFoundException("Agence", "id", String.valueOf(agenceId))
        );
    }
    private ActifCategorie getCategorieByName(String categorieName) {
        // get categorie from database
        return actifCategorieRepository.findByNom(categorieName).orElseThrow(
                () -> new ResourceNotFoundException("Consommable categorie", "nom", categorieName)
        );
    }
    private void addAgenceToActif(Long agenceId, Actif actif) {
        Agence agence = getAgenceById(agenceId);
        actif.setAgence(agence);
    }
    private void addCategorieToActif(String categorieName, Actif actif) {
        ActifCategorie categorie = getCategorieByName(categorieName);
        actif.setActifCategorie(categorie);
    }
    private Long getDisponibleQuantite(Actif actif) {
        // get number of elements with status not disponible
        Long elementsNotDisponible = elementRepository.countElementByActifAndStatusNot(actif.getId(), ElementStatus.DISPONIBLE);

        // get quantite total of actif
        Long quantiteTotal = actif.getQuantite();

        if(quantiteTotal == null)
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid Request");

        // calculate quantite disponible
        long quantiteDisponible = quantiteTotal - elementsNotDisponible;

        if(quantiteDisponible < 0)
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid Request");

        return quantiteDisponible;
    }
}
