package fr.norsys.gestionpatrimoine.collaborateur.mapper;

import fr.norsys.gestionpatrimoine.collaborateur.dto.*;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;


public class CollaborateurMapper {
    public static Collaborateur toEntity(CollaborateurDtoRequest dtoRequest) {
        Collaborateur collaborateur = new Collaborateur();
        collaborateur.setNom(dtoRequest.nom());
        collaborateur.setAdresse(dtoRequest.adresse());
        collaborateur.setPrenom(dtoRequest.prenom());
        collaborateur.setPoste(dtoRequest.poste());
        collaborateur.setSpecialite(dtoRequest.specialite());
        collaborateur.setCIN(dtoRequest.CIN());
        collaborateur.setEmail(dtoRequest.email());
        collaborateur.setDateEmbauche(dtoRequest.dateEmbauche());
        collaborateur.setTelephone(dtoRequest.telephone());
        return collaborateur;
    }

    public static CollaborateurDtoResponse toDto(Collaborateur collaborateur) {
        return new CollaborateurDtoResponse(
                collaborateur.getId(),
                collaborateur.getCIN(),
                collaborateur.getNom(),
                collaborateur.getPrenom(),
                collaborateur.getDateEmbauche(),
                collaborateur.getPoste(),
                collaborateur.getSpecialite(),
                collaborateur.getEmail(),
                collaborateur.getTelephone(),
                collaborateur.getAdresse(),
                collaborateur.getAgence().getNom(),
                collaborateur.getAgence().getId()
        );
    }
}
