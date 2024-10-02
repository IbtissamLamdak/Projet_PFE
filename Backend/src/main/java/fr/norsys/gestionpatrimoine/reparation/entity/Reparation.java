package fr.norsys.gestionpatrimoine.reparation.entity;


import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.reparation.enums.ReparationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "reparations")
public class Reparation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private  String description ;
    private LocalDateTime dateDebut ;
    private LocalDateTime dateFin ;
    private  String NomTechnicien ;
    private String TelephoneTechnicien ;
    private String Solution ;
    @Enumerated(EnumType.STRING)
    private ReparationStatus status;
    @OneToOne
    @JoinColumn(name = "maintenance_id")
    private  Maintenance maintenance ;

}
