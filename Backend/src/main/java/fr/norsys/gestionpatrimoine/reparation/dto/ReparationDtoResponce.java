package fr.norsys.gestionpatrimoine.reparation.dto;

import fr.norsys.gestionpatrimoine.reparation.enums.ReparationStatus;


import java.io.Serializable;
import java.time.LocalDateTime;

public record ReparationDtoResponce(
        long id , String description , LocalDateTime dateDebut, LocalDateTime dateFin ,
        ReparationStatus status ,String NomTechnicien ,String TelephoneTechnicien ,
        String Solution ,String NumeroSerie ,
                                     long maintenance_id )implements Serializable {
}
