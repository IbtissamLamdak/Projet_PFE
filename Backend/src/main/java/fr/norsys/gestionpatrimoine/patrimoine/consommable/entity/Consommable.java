package fr.norsys.gestionpatrimoine.patrimoine.consommable.entity;

import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@DiscriminatorValue("consommable")
@Table(name = "consommables")
public class Consommable extends Materiel {
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private ConsommableCategorie consommableCategorie;
}
