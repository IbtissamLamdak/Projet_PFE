package fr.norsys.gestionpatrimoine.maintenance.entity;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import jakarta.persistence.*;
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
@Table(name = "maintenances")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    private String description ;
    private LocalDateTime date_maintenance ;
    @Enumerated(EnumType.STRING)
    private MaintenanceType status;
    @OneToOne(mappedBy = "maintenance")
    private  Reparation  reparation;
    @ManyToOne
    @JoinColumn(name = "element_id")
    private Element element ;
    @ManyToOne
    private Collaborateur collaborateur ;

//    public void setStatusAndUpdateReparation(MaintenanceType newType) {
//        if (newType == MaintenanceType.EN_COURS) {
//            this.status = MaintenanceType.EN_COURS;
//            if (this.reparation != null) {
//                this.reparation.setStatus(ReparationStatus.EN_ATTENTE);
//            }
//        } else if (newType == MaintenanceType.RESOLU) {
//            this.status = MaintenanceType.RESOLU;
//        } else if (newType == MaintenanceType.ANNULE) {
//            this.status = MaintenanceType.ANNULE;
//        }
//    }
}
