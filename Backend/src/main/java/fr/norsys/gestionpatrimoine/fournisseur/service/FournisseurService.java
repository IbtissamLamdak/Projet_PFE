package fr.norsys.gestionpatrimoine.fournisseur.service;

import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoRequest;
import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoResponse;
import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;

import java.util.List;

public interface FournisseurService {
    FournisseurDtoResponse findFournisseurById(Long id);
    List<FournisseurDtoResponse> findAllFournisseurs();
    FournisseurDtoResponse addFournisseur(FournisseurDtoRequest fournisseur);
    FournisseurDtoResponse updateFournisseur(Long id,FournisseurDtoRequest fournisseur);
    void deleteFournisseur(Long id);
}
