package fr.norsys.gestionpatrimoine.reparation.mapper;

import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoRequest;
import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoResponce;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;

public class ReparationMapper {
    public static Reparation toEntity(ReparationDtoRequest request) {
        Reparation reparation = new Reparation();
        reparation.setDateFin(request.dateFin());
        reparation.setDateDebut(request.dateDebut());
        reparation.setStatus(request.status());
        reparation.setDescription(request.description());
        reparation.setNomTechnicien(request.NomTechnicien());
        reparation.setTelephoneTechnicien(request.TelephoneTechnicien());
        reparation.setSolution(request.Solution());
        return reparation;
    }

    public static ReparationDtoResponce toDto(Reparation reparation) {
        return new ReparationDtoResponce(
                reparation.getId(),
                reparation.getDescription(),
                reparation.getDateDebut(),
                reparation.getDateFin(),
                reparation.getStatus(),
                reparation.getNomTechnicien(),
                reparation.getTelephoneTechnicien(),
                reparation.getSolution(),
                reparation.getMaintenance().getElement().getNumeroSerie(),

                reparation.getMaintenance().getId()


        );
    }
}