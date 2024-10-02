package fr.norsys.gestionpatrimoine.plateau.entity;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@AllArgsConstructor // lombok
@NoArgsConstructor  // lombok
@Setter  // lombok
@Getter
@Entity
public class Plateau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id; // Identifiant unique du plateau
    private String name; // Nom du plateau
    private int floor; // Étage du plateau
    private int capacity; // Capacité du plateau (nombre de personnes pouvant y travailler)
    private boolean hasMeetingRoom; // Indique si le plateau a une salle de réunion
    private boolean hasKitchen; // Indique si le plateau a une cuisine
    private boolean hasRestroom; // Indique si le plateau a des toilettes

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agence_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)

    private Agence agence;

}