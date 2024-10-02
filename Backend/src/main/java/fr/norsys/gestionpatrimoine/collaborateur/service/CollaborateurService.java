package fr.norsys.gestionpatrimoine.collaborateur.service;

import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoRequest;
import fr.norsys.gestionpatrimoine.collaborateur.dto.CollaborateurDtoResponse;

import java.util.List;

public interface CollaborateurService {
    CollaborateurDtoResponse findCollaborateurByid(long id);
    List<CollaborateurDtoResponse> findAllCollaborateur();
    CollaborateurDtoResponse addCollaborateur(CollaborateurDtoRequest dto);
    CollaborateurDtoResponse updateCollaborateur(CollaborateurDtoRequest dto, long id);
    void deleteCollaborateur(long id);
}
