package fr.norsys.gestionpatrimoine.affectation.entity;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.plateau.entity.Plateau;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "affectation")
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime date_debut ;
    private LocalDateTime date_fin ;

    @ManyToOne
    @JoinColumn(name = "element_id")
    private Element element;
    @ManyToOne
    private Collaborateur collaborateur ;
    @ManyToOne
    private Plateau plateau ;
}
