package fr.norsys.gestionpatrimoine.collaborateur.service;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.agence.repository.AgenceRepository;
import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoRequest;
import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoResponse;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.collaborateur.mapper.CollaborateurMapper;
import fr.norsys.gestionpatrimoine.collaborateur.repository.CollaborateurRepository;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollaborateurServiceImpl implements CollaborateurService {

    @Autowired
    private CollaborateurRepository collaborateurRepository;
    @Autowired
    private AgenceRepository agenceRepository;

    @Override
    public CollaborateurDtoResponse findCollaborateurByid(long id) {
        Collaborateur collaborateur = collaborateurRepository.findById(id).orElseThrow(
                () -> new RuntimeException("collaborateur not found")
        );
        return CollaborateurMapper.toDto(collaborateur);
    }

    @Override
    public List<CollaborateurDtoResponse> findAllCollaborateur() {
        return  collaborateurRepository.findAll().stream()
                .map(CollaborateurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CollaborateurDtoResponse addCollaborateur(CollaborateurDtoRequest dto) {
        Collaborateur collaborateur = CollaborateurMapper.toEntity(dto);

        // get agence from db
        Agence agence = agenceRepository.findById(dto.agenceId()).orElseThrow(
                () -> new ResourceNotFoundException("Agence", "id", dto.agenceId().toString())
        );

        collaborateur.setAgence(agence);

        return  CollaborateurMapper.toDto(collaborateurRepository.save(collaborateur));
    }

    @Override
    public CollaborateurDtoResponse updateCollaborateur(CollaborateurDtoRequest dto, long id) {
        Collaborateur collaborateur = collaborateurRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Collaborateur not found with id " + id)
        );

        Agence agence = agenceRepository.findById(dto.agenceId()).orElseThrow(
                () -> new ResourceNotFoundException("Agence", "id", dto.agenceId().toString())
        );

        collaborateur.setCIN(dto.CIN());
        collaborateur.setNom(dto.prenom());
        collaborateur.setPrenom(dto.prenom());
        collaborateur.setDateEmbauche(dto.dateEmbauche());
        collaborateur.setPoste(dto.poste());
        collaborateur.setSpecialite(dto.specialite());
        collaborateur.setEmail(dto.email());
        collaborateur.setTelephone(dto.telephone());
        collaborateur.setAdresse(dto.adresse());
        collaborateur.setAgence(agence);

        Collaborateur updatedCollaborateur = collaborateurRepository.save(collaborateur);
        return CollaborateurMapper.toDto(updatedCollaborateur);
    }

    @Override
    public void deleteCollaborateur(long id) {
        Collaborateur collaborateur = collaborateurRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Collaborateur not found with id " + id)
        );

        collaborateurRepository.delete(collaborateur);
    }
}
