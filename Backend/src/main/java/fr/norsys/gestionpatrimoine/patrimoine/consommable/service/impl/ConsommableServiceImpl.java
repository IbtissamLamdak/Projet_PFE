package fr.norsys.gestionpatrimoine.patrimoine.consommable.service.impl;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.agence.repository.AgenceRepository;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.Consommable;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.ConsommableCategorie;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.mapper.ConsommableMapper;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.repository.ConsommableCategorieRepository;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.repository.ConsommableRepository;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.service.ConsommableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsommableServiceImpl implements ConsommableService {
    private final ConsommableRepository consommableRepository;
    private final AgenceRepository agenceRepository;
    private final ConsommableCategorieRepository categorieRepository;
    @Override
    public ConsommableDtoResponse create(ConsommableDtoRequest request) {
        // dto to entity
        Consommable consommable = ConsommableMapper.INSTANCE.toEntity(request);

        // add categorie and agence to consommable
        addAgenceToConsommable(request.agenceId(), consommable);
        addCategorieToConsommable(request.consommableCategorie(), consommable);

        // save consommable in database
        Consommable savedConsommable = consommableRepository.save(consommable);

        return ConsommableMapper.INSTANCE.toDto(savedConsommable);
    }
    @Override
    public ConsommableDtoResponse getById(Long id) {
        //get consommable from database
        Consommable consommable = getConsommableById(id);
        return ConsommableMapper.INSTANCE.toDto(consommable);
    }
    @Override
    public List<ConsommableDtoResponse> getAll() {
        return consommableRepository.findAll().stream()
                .map(ConsommableMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public ConsommableDtoResponse update(Long id, ConsommableDtoRequest request) {
        // get consommable from database
        Consommable consommable = getConsommableById(id);

        // update consommable
        consommable.setNom(request.nom());
        consommable.setDescription(request.description());
        consommable.setMarque(request.marque());
        consommable.setQuantite(request.quantite());

        addAgenceToConsommable(request.agenceId(), consommable);
        addCategorieToConsommable(request.consommableCategorie(), consommable);

        // save update in database
        Consommable updatedConsommable = consommableRepository.save(consommable);

        return ConsommableMapper.INSTANCE.toDto(updatedConsommable);
    }
    @Override
    public void delete(Long id) {
        // get consommable from database
        Consommable consommable = getConsommableById(id);

        // remove consommable from database
        consommableRepository.delete(consommable);
    }
    private Consommable getConsommableById(Long id) {
        return consommableRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Consommable", "id", String.valueOf(id))
        );
    }
    private Agence getAgenceById(Long agenceId) {
        // get agence from database
        return agenceRepository.findById(agenceId).orElseThrow(
                () -> new ResourceNotFoundException("Agence", "id", String.valueOf(agenceId))
        );
    }
    private ConsommableCategorie getCategorieByName(String categorie) {
        // get categorie from database
        return categorieRepository.findByNom(categorie).orElseThrow(
                () -> new ResourceNotFoundException("Consommable categorie", "nom", categorie)
        );
    }
    private void addAgenceToConsommable(Long agenceId, Consommable consommable) {
        Agence agence = getAgenceById(agenceId);
        consommable.setAgence(agence);
    }
    private void addCategorieToConsommable(String categorie, Consommable consommable) {
        ConsommableCategorie consommableCategorie = getCategorieByName(categorie);
        consommable.setConsommableCategorie(consommableCategorie);
    }
}
