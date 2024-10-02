package fr.norsys.gestionpatrimoine.maintenance.mapper;

import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoRequest;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;

public class MaintenanceMapper {
    public static Maintenance toEntity(MaintenanceDtoRequest request) {
        Maintenance maintenance = new Maintenance();
        maintenance.setDescription(request.description());
        maintenance.setDate_maintenance(request.date_maintenance());
        maintenance.setStatus(request.status());

        return maintenance;
    }

    public static MaintenanceDtoResponce toDto(Maintenance maintenance) {
        Reparation reparation = maintenance.getReparation();
        Long reparationId = null;

        if(reparation != null)
            reparationId = reparation.getId();

        assert reparationId != null;

        return new MaintenanceDtoResponce(
                maintenance.getId(),
                maintenance.getDescription(),
                maintenance.getDate_maintenance(),
                maintenance.getStatus(),
                reparationId,
                maintenance.getElement().getNumeroSerie(),
                maintenance.getCollaborateur().getId()
        );

    }
}