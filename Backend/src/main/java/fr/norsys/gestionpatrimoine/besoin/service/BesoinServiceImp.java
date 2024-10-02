package fr.norsys.gestionpatrimoine.besoin.service;

import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoRequest;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse;
import fr.norsys.gestionpatrimoine.besoin.entity.Besoin;
import fr.norsys.gestionpatrimoine.besoin.mapper.BesoinMapper;
import fr.norsys.gestionpatrimoine.besoin.repository.BesoinRepository;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.collaborateur.repository.CollaborateurRepository;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.repository.MaterielRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BesoinServiceImp  implements  BesoinService{

    private final BesoinRepository besoinRepos;
    private final CollaborateurRepository collaborateurRepository;
    private final MaterielRepository materielRepository;

    @Autowired
    public BesoinServiceImp(BesoinRepository besoinRepos,
                            CollaborateurRepository collaborateurRepository,
                            MaterielRepository materielRepository) {
        this.besoinRepos = besoinRepos;
        this.collaborateurRepository = collaborateurRepository;
        this.materielRepository = materielRepository;
    }

    @Override
    public BesoinDtoResponse findBesoinByid(Long id) {
        Besoin besoin = besoinRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Besoin", "id", String.valueOf(id)));

        // Map the entity to DTO
        return BesoinMapper.toDto(besoin);
    }

    @Override
    public List<BesoinDtoResponse> findAllBesoin() {
        List<Besoin> besoins = besoinRepos.findAll();

        // Map the list of entities to a list of DTOs
        return besoins.stream()
                .map(BesoinMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BesoinDtoResponse addBesoin(BesoinDtoRequest besoinDtoRequest) {
        Besoin besoin = BesoinMapper.toEntity(besoinDtoRequest);

        // get collaborateur from db
        Collaborateur collaborateur = getCollaborateur(besoinDtoRequest.collaborateurId());
        besoin.setCollaborateur(collaborateur);

        // get materiels from db
        Materiel materiel = getMateriel(besoinDtoRequest.materielId());
        besoin.setMateriel(materiel);

        Besoin savedBesoin = besoinRepos.save(besoin);

        // Map the saved entity to DTO
        return BesoinMapper.toDto(savedBesoin);
    }

    @Override
    public BesoinDtoResponse updateBesoin(BesoinDtoRequest besoinDtoRequest, Long id) {
        Besoin besoinToUpdate = besoinRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Besoin", "id", String.valueOf(id)));

        // Update the entity with new values
        besoinToUpdate.setDescription(besoinDtoRequest.description());
        besoinToUpdate.setStatus(besoinDtoRequest.status());
        besoinToUpdate.setDateReclamation(besoinDtoRequest.dateReclamation());
        besoinToUpdate.setQuantite(besoinDtoRequest.quantite());

        // get collaborateur from db
        Collaborateur collaborateur = getCollaborateur(besoinDtoRequest.collaborateurId());
        besoinToUpdate.setCollaborateur(collaborateur);

        // get materiels from db
        Materiel materiel = getMateriel(besoinDtoRequest.materielId());

        besoinToUpdate.setMateriel(materiel);


        // Save the updated entity
        Besoin updatedBesoin = besoinRepos.save(besoinToUpdate);

        // Map the updated entity to DTO
        return BesoinMapper.toDto(updatedBesoin);
    }

    @Override
    public void deleteBesoin(Long id) {
        besoinRepos.deleteById(id);
    }
    private Collaborateur getCollaborateur(Long id) {
        return collaborateurRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Collaborateur", "id", String.valueOf(id))
        );
    }
    private Materiel getMateriel(Long id) {
        return materielRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Materiel", "id", String.valueOf(id))
        );
    }
}
