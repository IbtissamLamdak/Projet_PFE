package fr.norsys.gestionpatrimoine.bon.mapper;

import fr.norsys.gestionpatrimoine.bon.dto.BonDtoRequest;
import fr.norsys.gestionpatrimoine.bon.dto.BonDtoResponse;
import fr.norsys.gestionpatrimoine.bon.entity.Bon;


public class BonMapper {
    public static Bon toEntity(BonDtoRequest dtoRequest) {
        Bon bon = new Bon();
        bon.setNumeroBon(dtoRequest.numeroBon());
        bon.setPrix(dtoRequest.prix());
        bon.setNumeroBon(dtoRequest.numeroBon());
        bon.setDateLivraison(dtoRequest.dateLivraison());
        bon.setQuantiteDemande(dtoRequest.quantiteDemande());

        return bon;
    }

    public static BonDtoResponse toDto(Bon bon) {
        String fournissuerFullName = String.format("%s %s", bon.getFournisseur().getNom(), bon.getFournisseur().getPrenom());

        return new BonDtoResponse(
                bon.getNumeroBon(),
                bon.getMateriel().getId(),
                bon.getMateriel().getNom(),
                bon.getPrix(),
                bon.getQuantiteDemande(),
                bon.getDateLivraison(),
                bon.getFournisseur().getId(),
                fournissuerFullName
        );
    }
}
