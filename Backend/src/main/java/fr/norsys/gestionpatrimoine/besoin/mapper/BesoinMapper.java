package fr.norsys.gestionpatrimoine.besoin.mapper;

import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoRequest;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse.CollaborateurDto;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse.CollaborateurDto.AgenceDto;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse.MaterielDto;
import fr.norsys.gestionpatrimoine.besoin.entity.Besoin;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;
import java.util.stream.Collectors;

public class BesoinMapper {
    public static Besoin toEntity(BesoinDtoRequest request) {
        Besoin besoin = new Besoin();
        besoin.setDescription(request.description());
        besoin.setDateReclamation(request.dateReclamation());
        besoin.setStatus(request.status());
        besoin.setQuantite(request.quantite());
        return besoin;
    }

    public static BesoinDtoResponse toDto(Besoin besoin) {
        final MaterielDto materielDto = new MaterielDto(besoin.getMateriel().getId(), besoin.getMateriel().getNom());

        final CollaborateurDto collaborateurDto = getCollaborateurDto(besoin);

        return new BesoinDtoResponse(
                besoin.getId(),
                besoin.getDescription(),
                besoin.getDateReclamation(),
                besoin.getStatus(),
                besoin.getQuantite(),
                materielDto,
                collaborateurDto
        );
    }

    private static CollaborateurDto getCollaborateurDto(Besoin besoin) {
        final AgenceDto agenceDto = new AgenceDto(besoin.getCollaborateur().getAgence().getId(), besoin.getCollaborateur().getAgence().getNom());

        return new CollaborateurDto(
                besoin.getCollaborateur().getId(),
                besoin.getCollaborateur().getNom(),
                besoin.getCollaborateur().getPrenom(),
                agenceDto
        );
    }
}
