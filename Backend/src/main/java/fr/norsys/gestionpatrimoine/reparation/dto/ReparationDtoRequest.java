package fr.norsys.gestionpatrimoine.reparation.dto;

import fr.norsys.gestionpatrimoine.reparation.enums.ReparationStatus;

import java.io.Serializable;
import java.time.LocalDateTime;

public record ReparationDtoRequest(String description ,
                                   LocalDateTime dateDebut, LocalDateTime dateFin ,
                                   String NomTechnicien ,String TelephoneTechnicien , String Solution ,
                                   ReparationStatus status ,long maintenance_id)  implements Serializable {
}
