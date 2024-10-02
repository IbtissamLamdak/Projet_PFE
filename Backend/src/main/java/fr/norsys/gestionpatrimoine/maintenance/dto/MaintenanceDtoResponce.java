package fr.norsys.gestionpatrimoine.maintenance.dto;


import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;

import java.time.LocalDateTime;

public record MaintenanceDtoResponce(Long id , String description , LocalDateTime date_maintenance, MaintenanceType status,
                                     Long reparation_id, String numero_serie , long  collaborateur_id)
{
}
