package fr.norsys.gestionpatrimoine.fournisseur.mapper;

import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoRequest;
import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoResponse;
import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;

public class FournisseurMapper {
    public static Fournisseur toEntity(FournisseurDtoRequest dtoRequest) {
        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setNom(dtoRequest.nom());
        fournisseur.setPrenom(dtoRequest.prenom());
        fournisseur.setAdresse(dtoRequest.adresse());
        fournisseur.setVille(dtoRequest.ville());
        fournisseur.setPays(dtoRequest.pays());
        fournisseur.setEmail(dtoRequest.email());
        fournisseur.setTel(dtoRequest.tel());

        return fournisseur;
    }

    public static FournisseurDtoResponse toDto(Fournisseur fournisseur) {
        return new FournisseurDtoResponse(
                fournisseur.getId(),
                fournisseur.getNom(),
                fournisseur.getPrenom(),
                fournisseur.getEmail(),
                fournisseur.getAdresse(),
                fournisseur.getVille(),
                fournisseur.getPays(),
                fournisseur.getTel()

        );
    }
}
