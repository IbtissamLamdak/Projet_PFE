package fr.norsys.gestionpatrimoine.besoin.entity;

import fr.norsys.gestionpatrimoine.besoin.enums.BesoinStatus;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Besoin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String description ;
    private LocalDateTime dateReclamation;
    private BesoinStatus status ;
    private Long quantite;
    @ManyToOne
    private Collaborateur collaborateur;
    @ManyToOne
    @JoinColumn(name = "materiel_id")
    private Materiel materiel;
}
