package fr.norsys.gestionpatrimoine.patrimoine.actif.entity;


import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@DiscriminatorValue("actif")
@Table(name = "actifs")
public class Actif extends Materiel {
    @Column(name = "quantite_disponible")
    private Long quantiteDisponible;
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private ActifCategorie actifCategorie;
    @Column(name = "modèle")
    private String modele;
    @OneToMany(mappedBy = "actif")
    private Set<Element> elements;
}
