package fr.norsys.gestionpatrimoine.maintenance.dto;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;

import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;


import java.io.Serializable;
import java.time.LocalDateTime;

public record MaintenanceDtoRequest(String description , LocalDateTime date_maintenance, MaintenanceType status ,
                                   String numero_serie  , Long collaborateur_id  ) implements Serializable
{
}
