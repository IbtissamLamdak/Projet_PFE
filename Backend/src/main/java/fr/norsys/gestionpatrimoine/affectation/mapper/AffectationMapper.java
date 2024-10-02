package fr.norsys.gestionpatrimoine.affectation.mapper;

import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoRequest;
import fr.norsys.gestionpatrimoine.affectation.dto.AffectationDtoResponse;
import fr.norsys.gestionpatrimoine.affectation.entity.Affectation;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;

public class AffectationMapper {
    public static Affectation toEntity(AffectationDtoRequest request) {
        Affectation affectation = new Affectation();
        affectation.setDate_debut(request.date_debut());
        affectation.setDate_fin(request.date_fin());
        return affectation;
    }

    public static AffectationDtoResponse toDto(Affectation affectation) {
        return new AffectationDtoResponse(
                affectation.getId(),
                affectation.getCollaborateur().getId(),
                affectation.getDate_debut(),
                affectation.getDate_fin(),
                affectation.getElement().getNumeroSerie(),
                affectation.getPlateau().getAgence().getNom(),
                affectation.getPlateau().getName(),
                affectation.getCollaborateur().getNom(),
                affectation.getCollaborateur().getPrenom(),
                affectation.getPlateau().getAgence().getId(),
                affectation.getPlateau().getId()

        );
    }
}
